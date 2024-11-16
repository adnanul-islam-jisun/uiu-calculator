let courseCount = 1;

document.addEventListener('DOMContentLoaded', function() {
    const addMoreBtn = document.querySelector('.add-more-btn');
    const coursesContainer = document.querySelector('.courses');

    function updateCourseNumbers() {
        const courseLabels = document.querySelectorAll('.course-label');
        courseLabels.forEach((label, index) => {
            label.textContent = `Course ${index + 1}`;
        });
        courseCount = courseLabels.length;
    }

    addMoreBtn.addEventListener('click', function() {
        courseCount++;
        
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row';
        
        courseRow.innerHTML = `
            <span class="course-label">Course ${courseCount}</span>
            <select class="credit-select">
                <option value="">Credit</option>
                <option value="1">1.0</option>
                <option value="2">2.0</option>
                <option value="3">3.0</option>
                <option value="3">4.5</option>
            </select>
            <select class="grade-select">
                <option value="">Grade</option>
                <option value="4.00">A</option>
                <option value="3.67">A-</option>
                <option value="3.33">B+</option>
                <option value="3.00">B</option>
                <option value="2.67">B-</option>
                <option value="2.33">C+</option>
                <option value="2.00">C</option>
                <option value="1.67">C-</option>
                <option value="1.33">D+</option>
                <option value="1.00">D</option>
                <option value="0.00">F</option>
            </select>
            <button class="remove-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // Add remove button functionality
        const removeBtn = courseRow.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            courseRow.remove();
            updateCourseNumbers();
        });
        
        coursesContainer.appendChild(courseRow);
    });

    // Add remove functionality to initial course
    const initialRemoveBtn = document.querySelector('.course-row .remove-btn');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            this.closest('.course-row').remove();
            updateCourseNumbers();
        });
    }

    // Add calculate button event listener
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.addEventListener('click', calculateCGPA);

    // Add reset functionality
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', function() {
        // Reset input fields
        document.querySelectorAll('.input-group input').forEach(input => {
            input.value = '';
        });

        // Remove all courses except the first one
        const courses = document.querySelectorAll('.course-row');
        courses.forEach((course, index) => {
            if (index !== 0) {
                course.remove();
            }
        });

        // Reset first course selections
        const firstCourse = document.querySelector('.course-row');
        if (firstCourse) {
            firstCourse.querySelector('.credit-select').value = '';
            firstCourse.querySelector('.grade-select').value = '';
        }

        // Reset course counter
        courseCount = 1;
        updateCourseNumbers();

        // Remove all retake rows
        document.querySelectorAll('.retake-row').forEach(row => row.remove());
        isRetakeHeaderAdded = false;
    });

    // Add retake functionality
    const retakeBtn = document.querySelector('.retake-btn');
    let isRetakeHeaderAdded = false;

    retakeBtn.addEventListener('click', function() {
        if (!isRetakeHeaderAdded) {
            // Add retake section headers
            const retakeHeaders = document.createElement('div');
            retakeHeaders.className = 'retake-row';
            retakeHeaders.innerHTML = `
                <div class="retake-header">Credit</div>
                <div class="retake-header">Old Grade</div>
                <div class="retake-header">New Grade</div>
                <div class="retake-header">Action</div>
            `;
            coursesContainer.appendChild(retakeHeaders);
            isRetakeHeaderAdded = true;
        }

        // Add retake row
        const retakeRow = document.createElement('div');
        retakeRow.className = 'retake-row';
        retakeRow.innerHTML = `
            <select class="credit-select">
                <option value="">Credit</option>
                <option value="1">1.0</option>
                <option value="2">2.0</option>
                <option value="3">3.0</option>
                <option value="4.5">4.5</option>
            </select>
            <select class="old-grade-select">
                <option value="">Old Grade</option>
                <option value="3.67">A-</option>
                <option value="3.33">B+</</option>
                <option value="3.00">B</option>
                <option value="2.67">B-</option>
                <option value="2.33">C+</</option>
                <option value="2.00">C</option>
                <option value="1.67">C-</option>
                <option value="1.33">D+</</option>
                <option value="1.00">D</option>
                <option value="0.00">F</option>
            </select>
            <select class="grade-select">
                <option value="">New Grade</option>
                <option value="4.00">A</option>
                <option value="3.67">A-</option>
                <option value="3.33">B+</</option>
                <option value="3.00">B</option>
                <option value="2.67">B-</option>
                <option value="2.33">C+</</option>
                <option value="2.00">C</option>
                <option value="1.67">C-</option>
                <option value="1.33">D+</</option>
                <option value="1.00">D</option>
                <option value="0.00">F</option>
            </select>
            <button class="remove-btn"><i class="fas fa-trash"></i></button>
        `;

        // Add remove functionality for retake row
        const removeBtn = retakeRow.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            retakeRow.remove();
            // Remove headers if no retake rows left
            const retakeRows = document.querySelectorAll('.retake-row');
            if (retakeRows.length === 1) { // Only header row left
                retakeRows[0].remove();
                isRetakeHeaderAdded = false;
            }
        });

        coursesContainer.appendChild(retakeRow);
    });

    function calculateCGPA() {
        // Get input values with validation
        const completedCreditsInput = document.querySelector('input[placeholder="Completed Credits"]');
        const currentCGPAInput = document.querySelector('input[placeholder="Current CGPA"]');
        
        if (!completedCreditsInput || !currentCGPAInput) {
            alert('Error: Required input fields not found!');
            return;
        }
    
        const completedCredits = parseFloat(completedCreditsInput.value) || 0;
        const currentCGPA = parseFloat(currentCGPAInput.value) || 0;
        
        // Initialize variables
        let totalPoints = completedCredits * currentCGPA;
        let totalCredits = completedCredits;
        let semesterCredits = 0;
        let semesterPoints = 0;
    
        // Calculate regular courses (using more specific selector)
        const regularCourses = Array.from(document.querySelectorAll('.course-row')).filter(row => 
            !row.classList.contains('retake-row') && 
            row.querySelector('.credit-select') && 
            row.querySelector('.grade-select')
        );
    
        console.log('Regular courses found:', regularCourses.length); // Debug log
    
        regularCourses.forEach(row => {
            const credit = parseFloat(row.querySelector('.credit-select').value) || 0;
            const grade = parseFloat(row.querySelector('.grade-select').value) || 0;
            
            console.log('Regular course:', { credit, grade }); // Debug log
            
            if (credit && grade) {
                totalCredits += credit;
                totalPoints += (credit * grade);
                semesterCredits += credit;
                semesterPoints += (credit * grade);
            }
        });
    
        // Add variables to track retake improvements
        let totalRetakeCredits = 0;
        let totalImprovement = 0;

        // Calculate retake courses (using more specific selector)
        const retakeCourses = Array.from(document.querySelectorAll('.retake-row')).filter(row => 
            row.querySelector('.credit-select') && 
            row.querySelector('.old-grade-select') && 
            row.querySelector('.grade-select')
        );
    
        console.log('Retake courses found:', retakeCourses.length); // Debug log
    
        retakeCourses.forEach(row => {
            if (row.querySelector('.retake-header')) return; // Skip header row
            
            const credit = parseFloat(row.querySelector('.credit-select').value) || 0;
            const oldGrade = parseFloat(row.querySelector('.old-grade-select').value) || 0;
            const newGrade = parseFloat(row.querySelector('.grade-select').value) || 0;
            
            console.log('Retake course:', { credit, oldGrade, newGrade }); // Debug log
            
            if (credit && oldGrade && newGrade) {
                totalPoints = totalPoints - (credit * oldGrade) + (credit * newGrade);
                semesterCredits += credit;
                semesterPoints += (credit * newGrade);
                
                // Calculate improvement
                totalRetakeCredits += credit;
                totalImprovement += credit * (newGrade - oldGrade);
            }
        });
    
        // Validate calculations
        if (totalCredits === 0) {
            alert('Please enter valid course information.');
            return;
        }
    
        // Calculate final results
        const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;
        const finalCGPA = totalPoints / totalCredits;
        const averageImprovement = totalRetakeCredits > 0 ? (totalImprovement / totalRetakeCredits) : 0;

        // Show results with improvement information
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>CGPA Calculation Results</h2>
                <p>Total Credits: ${totalCredits.toFixed(2)}</p>
                <p>Semester Credits: ${semesterCredits.toFixed(2)}</p>
                <p>Semester GPA: ${semesterGPA.toFixed(2)}</p>
                ${totalRetakeCredits > 0 ? `
                    <p>Retake Credits: ${totalRetakeCredits.toFixed(2)}</p>
                    <p>Average Grade Improvement: ${averageImprovement.toFixed(2)}</p>
                ` : ''}
                <p>Final CGPA: ${finalCGPA.toFixed(2)}</p>
                <button class="close-popup">Close</button>
            </div>
        `;
    
        document.body.appendChild(popup);
    
        // Add close button functionality
        const closeButton = popup.querySelector('.close-popup');
        if (closeButton) {
            closeButton.addEventListener('click', () => popup.remove());
        }
    }
});