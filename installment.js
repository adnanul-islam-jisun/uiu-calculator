document.addEventListener('DOMContentLoaded', function() {
    // Add deselection functionality for radio buttons
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('click', function(e) {
                if (this.dataset.prevChecked === 'true') {
                    this.checked = false;
                    this.dataset.prevChecked = 'false';
                } else {
                    radios.forEach(r => r.dataset.prevChecked = 'false');
                    this.dataset.prevChecked = 'true';
                }
            });
        });
    });

    const calculateBtn = document.querySelector('.calculate-btn');

    calculateBtn.addEventListener('click', function() {
        console.log('Calculate button clicked'); // Debug line

        const newCredit = parseFloat(document.querySelector('input[placeholder="New Credit"]').value) || 0;
        const retakeCredit = parseFloat(document.querySelector('input[placeholder="Retake Credit"]').value) || 0;
        const perCreditFee = parseFloat(document.querySelector('input[placeholder="Per Credit Fee"]').value) || 0;

        console.log('Input values:', { newCredit, retakeCredit, perCreditFee }); // Debug line
        
        const waiver = parseFloat(document.querySelector('input[name="waiver"]:checked')?.value) || 0;
        const scholarship = parseFloat(document.querySelector('input[name="scholarship"]:checked')?.value) || 0;
        const isLateRegistration = document.querySelector('input[name="late"]:checked')?.value === 'yes';
        const registrationFee = parseFloat(document.querySelector('#registration-fee').value) || 5000;

        // Calculate fees separately for new and retake credits
        const newCreditFee = newCredit * perCreditFee;
        const retakeCreditFee = (retakeCredit * perCreditFee) * 0.5; // 50% off for retake
        
        // Modified: Apply discount only to new credit fee
        const discountPercentage = Math.max(waiver, scholarship);
        let discountType = waiver >= scholarship ? 'Waiver' : 'Scholarship';
        const discountAmount = (newCreditFee * discountPercentage) / 100; // Changed to use newCreditFee instead of totalCreditFee
        
        // Calculate total credit fee after retake discount
        const totalCreditFee = newCreditFee + retakeCreditFee;
        
        // Add late registration fee if applicable
        const lateRegistrationFee = isLateRegistration ? 1000 : 0;
        
        // Add registration fee
        const finalAmount = (newCreditFee - discountAmount + retakeCreditFee) + lateRegistrationFee + registrationFee;

        // Show results in table
        const resultsSection = document.getElementById('results-section');
        const resultsBody = document.getElementById('results-body');
        const finalAmountCell = document.getElementById('final-amount');

        if (!resultsSection || !resultsBody || !finalAmountCell) {
            console.error('Required elements not found!'); // Debug line
            return;
        }

        // Clear previous results
        resultsBody.innerHTML = '';

        // Add rows to table
        const addRow = (label, amount, isDeduction = false) => {
            const row = document.createElement('tr');
            if (isDeduction) row.className = 'deduction-row';
            row.innerHTML = `
                <td>${label}</td>
                <td>${isDeduction ? '- ' : ''}${amount.toFixed(2)} Tk</td>
            `;
            resultsBody.appendChild(row);
            console.log('Added row:', label, amount); // Debug line
        };

        // Add fees
        addRow('Total Credit Fees', totalCreditFee+retakeCreditFee);
        addRow('Registration/Trimester Fee', registrationFee);
        
        if (isLateRegistration) {
            addRow('Late Registration Fee', lateRegistrationFee);
        }
        
        // Add deductions
        if (retakeCredit > 0) {
            addRow('Retake Discount (50%)', retakeCreditFee, true);
        }
        
        // Modified this section to use the determined discount type
        if (discountPercentage > 0) {
            addRow(`${discountType} Discount (${discountPercentage}%)`, discountAmount, true);
        }

        // Set final amount
        finalAmountCell.textContent = `${finalAmount.toFixed(2)} Tk`;
        
        // Calculate and display installments
        const installmentBody = document.getElementById('installment-body');
        installmentBody.innerHTML = '';
        
        const installments = [
            { name: '1st Installment', percentage: 40 },
            { name: '2nd Installment', percentage: 30 },
            { name: '3rd Installment', percentage: 30 }
        ];
        
        installments.forEach(installment => {
            const amount = (finalAmount * installment.percentage) / 100;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${installment.name}</td>
                <td>${installment.percentage}%</td>
                <td>${amount.toFixed(2)} Tk</td>
            `;
            installmentBody.appendChild(row);
        });
        
        // Show results section
        resultsSection.style.display = 'block';
        console.log('Results displayed'); // Debug line
    });
});