document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
    });

    // Elements
    const form = document.getElementById('calculatorForm');
    const genderCards = document.querySelectorAll('.gender-card');
    
    // Number Inputs
    const ageInput = document.getElementById('ageInput');
    const heightCmInput = document.getElementById('heightCmInput');
    const heightFtInput = document.getElementById('heightFtInput');
    const heightInInput = document.getElementById('heightInInput');
    const weightKgInput = document.getElementById('weightKgInput');
    const weightLbsInput = document.getElementById('weightLbsInput');
    
    // Body Fat Inputs
    const bodyfatToggle = document.getElementById('bodyfatToggle');
    const bodyfatInputsPanel = document.getElementById('bodyfatInputsPanel');
    const hipInputGroup = document.getElementById('hipInputGroup');
    
    const neckInput = document.getElementById('neckInput');
    const waistInput = document.getElementById('waistInput');
    const hipInput = document.getElementById('hipInput');
    
    // Groups
    const heightMetricGroup = document.getElementById('heightMetricGroup');
    const heightImperialGroup = document.getElementById('heightImperialGroup');
    const weightMetricGroup = document.getElementById('weightMetricGroup');
    const weightImperialGroup = document.getElementById('weightImperialGroup');
    
    // Unit system selections
    const unitMetric = document.getElementById('unitMetric');
    const unitImperial = document.getElementById('unitImperial');
    const unitLabelMetric = document.querySelector('label[for="unitMetric"]');
    const unitLabelImperial = document.querySelector('label[for="unitImperial"]');
    
    // Results
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsContent = document.getElementById('resultsContent');
    const bmiScoreText = document.getElementById('bmiScoreText');
    const bmiCategoryText = document.getElementById('bmiCategoryText');
    const gaugePointer = document.getElementById('gaugePointer');
    
    // Body Fat Results
    const bodyfatCategoryText = document.getElementById('bodyfatCategoryText');
    const bodyfatMethodBadge = document.getElementById('bodyfatMethodBadge');
    const fatMassBar = document.getElementById('fatMassBar');
    const leanMassBar = document.getElementById('leanMassBar');
    const bodyfatPercentText = document.getElementById('bodyfatPercentText');
    const leanPercentText = document.getElementById('leanPercentText');
    const fatMassVal = document.getElementById('fatMassVal');
    const fatMassUnit = document.getElementById('fatMassUnit');
    const leanMassVal = document.getElementById('leanMassVal');
    const leanMassUnit = document.getElementById('leanMassUnit');
    
    const bfNavyVal = document.getElementById('bfNavyVal');
    const bfYmcaVal = document.getElementById('bfYmcaVal');
    const bfBmiVal = document.getElementById('bfBmiVal');
    
    const bmrValue = document.getElementById('bmrValue');
    const tdeeValue = document.getElementById('tdeeValue');
    const idealWeightValue = document.getElementById('idealWeightValue');
    const idealWeightUnit = document.getElementById('idealWeightUnit');
    const waterValue = document.getElementById('waterValue');
    
    const calorieLossValue = document.getElementById('calorieLossValue');
    const calorieMaintenanceValue = document.getElementById('calorieMaintenanceValue');
    const calorieGainValue = document.getElementById('calorieGainValue');
    
    const feedbackIndicator = document.getElementById('feedbackIndicator');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');

    // Body fat toggle display
    bodyfatToggle.addEventListener('change', () => {
        if (bodyfatToggle.checked) {
            bodyfatInputsPanel.classList.remove('hidden');
            // Show hip input conditionally
            const gender = document.querySelector('input[name="gender"]:checked').value;
            if (gender === 'female') {
                hipInputGroup.classList.remove('hidden');
            } else {
                hipInputGroup.classList.add('hidden');
            }
        } else {
            bodyfatInputsPanel.classList.add('hidden');
        }
    });

    // Helper to change input parameters dynamically
    function configureSlider(slider, min, max, value, unit) {
        slider.min = min;
        slider.max = max;
        slider.value = value;
        if (unit) {
            const unitLabel = document.getElementById(`${slider.id.replace('Input', '')}Unit`);
            if (unitLabel) unitLabel.textContent = unit;
        }
    }

    // Unit toggle logic
    function updateUnitSystem(system) {
        if (system === 'metric') {
            unitLabelMetric.classList.add('active');
            unitLabelImperial.classList.remove('active');
            
            heightMetricGroup.classList.remove('hidden');
            heightImperialGroup.classList.add('hidden');
            weightMetricGroup.classList.remove('hidden');
            weightImperialGroup.classList.add('hidden');
            
            // Sync values from imperial to metric
            const lbs = parseFloat(weightLbsInput.value) || 0;
            const kg = (lbs * 0.45359237).toFixed(1);
            weightKgInput.value = Math.max(30, Math.min(300, kg));
            
            const ft = parseInt(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            const cm = ((ft * 12 + inches) * 2.54).toFixed(1);
            heightCmInput.value = Math.max(100, Math.min(250, cm));

            // Update Body Fat inputs to Metric
            configureSlider(neckInput, 20, 100, (parseFloat(neckInput.value) * 2.54).toFixed(1), 'cm');
            configureSlider(waistInput, 10, 250, (parseFloat(waistInput.value) * 2.54).toFixed(1), 'cm');
            configureSlider(hipInput, 10, 250, (parseFloat(hipInput.value) * 2.54).toFixed(1), 'cm');
        } else {
            unitLabelImperial.classList.add('active');
            unitLabelMetric.classList.remove('active');
            
            heightMetricGroup.classList.add('hidden');
            heightImperialGroup.classList.remove('hidden');
            weightMetricGroup.classList.add('hidden');
            weightImperialGroup.classList.remove('hidden');
            
            // Sync values from metric to imperial
            const kg = parseFloat(weightKgInput.value) || 0;
            const lbs = (kg / 0.45359237).toFixed(1);
            weightLbsInput.value = Math.max(60, Math.min(700, lbs));
            
            const cm = parseFloat(heightCmInput.value) || 0;
            const totalInches = cm / 2.54;
            const feet = Math.floor(totalInches / 12);
            const remainingInches = (totalInches % 12).toFixed(1);
            
            heightFtInput.value = Math.max(3, Math.min(8, feet));
            heightInInput.value = Math.max(0, Math.min(11.9, remainingInches));

            // Update Body Fat inputs to Imperial
            configureSlider(neckInput, 5, 40, (parseFloat(neckInput.value) / 2.54).toFixed(1), 'in');
            configureSlider(waistInput, 4, 100, (parseFloat(waistInput.value) / 2.54).toFixed(1), 'in');
            configureSlider(hipInput, 4, 100, (parseFloat(hipInput.value) / 2.54).toFixed(1), 'in');
        }
    }

    unitMetric.addEventListener('change', () => updateUnitSystem('metric'));
    unitImperial.addEventListener('change', () => updateUnitSystem('imperial'));

    // Gender Card Selection Handler
    genderCards.forEach(card => {
        card.addEventListener('click', () => {
            genderCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radioId = card.getAttribute('for');
            document.getElementById(radioId).checked = true;
            
            // Re-eval hip field visibility
            const gender = document.getElementById(radioId).value;
            if (bodyfatToggle.checked && gender === 'female') {
                hipInputGroup.classList.remove('hidden');
            } else {
                hipInputGroup.classList.add('hidden');
            }
        });
    });

    // Form Calculation Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Inputs Gathering
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const system = document.querySelector('input[name="unitSystem"]:checked').value;
        const age = parseInt(ageInput.value);
        const activity = document.getElementById('activityInput').value;
        
        let heightCm, weightKg, heightInches;
        
        if (system === 'metric') {
            heightCm = parseFloat(heightCmInput.value);
            weightKg = parseFloat(weightKgInput.value);
            heightInches = heightCm / 2.54;
        } else {
            const lbs = parseFloat(weightLbsInput.value);
            weightKg = lbs * 0.45359237;
            
            const ft = parseInt(heightFtInput.value) || 0;
            const inches = parseInt(heightInInput.value) || 0;
            heightInches = ft * 12 + inches;
            heightCm = heightInches * 2.54;
        }

        // --- Math & Core Calculations (100% Precise) ---

        // A. BMI Calculation
        const heightMeters = heightCm / 100;
        const bmi = weightKg / (heightMeters * heightMeters);
        
        // B. BMR Calculation (Mifflin-St Jeor)
        let bmr = 0;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        }

        // C. TDEE Calculation (Activity multipliers)
        let activityMultiplier = 1.2;
        switch (activity) {
            case 'sedentary': activityMultiplier = 1.2; break;
            case 'light': activityMultiplier = 1.375; break;
            case 'moderate': activityMultiplier = 1.55; break;
            case 'active': activityMultiplier = 1.725; break;
            case 'extreme': activityMultiplier = 1.9; break;
        }
        const tdee = bmr * activityMultiplier;

        // D. Ideal Body Weight (Devine Formula)
        const inchesOverFiveFeet = Math.max(0, heightInches - 60);
        let idealWeightKg = 0;
        if (gender === 'male') {
            idealWeightKg = 50.0 + 2.3 * inchesOverFiveFeet;
        } else {
            idealWeightKg = 45.5 + 2.3 * inchesOverFiveFeet;
        }
        
        // E. Water Target
        let baseWaterMl = weightKg * 35;
        if (activity === 'moderate' || activity === 'active') {
            baseWaterMl += 500;
        } else if (activity === 'extreme') {
            baseWaterMl += 1000;
        }
        const waterLiters = baseWaterMl / 1000;

        // F. Body Fat Calculation
        let bodyFatPercent = 0;
        let bfMethodName = "BMI Estimated";
        
        // Compute Deurenberg (BMI-based) estimate
        let bfBmi = 0;
        if (gender === 'male') {
            bfBmi = 1.20 * bmi + 0.23 * age - 16.2;
        } else {
            bfBmi = 1.20 * bmi + 0.23 * age - 5.4;
        }
        bfBmi = Math.max(2, Math.min(60, bfBmi));

        if (bodyfatToggle.checked) {
            bfMethodName = "Weighted Average";
            
            // Read tape parameters
            let neck = parseFloat(neckInput.value);
            let waist = parseFloat(waistInput.value);
            let hip = parseFloat(hipInput.value);
            
            // 1. Calculate U.S. Navy Body Fat %
            let bfNavy = 0;
            if (gender === 'male') {
                let w = waist;
                if (w <= neck) w = neck + 1; // avoid log10(<=0)
                
                if (system === 'metric') {
                    bfNavy = (495 / (1.0324 - 0.19077 * Math.log10(w - neck) + 0.15456 * Math.log10(heightCm))) - 450;
                } else {
                    bfNavy = 86.010 * Math.log10(w - neck) - 70.041 * Math.log10(heightInches) + 36.76;
                }
            } else {
                let wh = waist + hip;
                if (wh <= neck) wh = neck + 1;
                
                if (system === 'metric') {
                    bfNavy = (495 / (1.29579 - 0.35004 * Math.log10(wh - neck) + 0.22100 * Math.log10(heightCm))) - 450;
                } else {
                    bfNavy = 163.205 * Math.log10(wh - neck) - 97.684 * Math.log10(heightInches) - 78.387;
                }
            }
            bfNavy = Math.max(2, Math.min(60, bfNavy));

            // 2. Calculate YMCA (Waist & Weight based) Body Fat %
            let bfYmca = 0;
            let weightLbsValLocal = system === 'metric' ? weightKg * 2.20462 : parseFloat(weightLbsInput.value);
            let waistInchesLocal = system === 'metric' ? waist / 2.54 : waist;
            
            if (gender === 'male') {
                bfYmca = ((4.15 * waistInchesLocal - 0.082 * weightLbsValLocal - 98.42) / weightLbsValLocal) * 100;
            } else {
                bfYmca = ((4.15 * waistInchesLocal - 0.082 * weightLbsValLocal - 76.76) / weightLbsValLocal) * 100;
            }
            bfYmca = Math.max(2, Math.min(60, bfYmca));

            // 3. Combined Weighted Average
            // 50% U.S. Navy, 25% YMCA, 25% Deurenberg
            bodyFatPercent = 0.5 * bfNavy + 0.25 * bfYmca + 0.25 * bfBmi;
            
            // Set individual displays
            bfNavyVal.textContent = bfNavy.toFixed(1) + "%";
            bfYmcaVal.textContent = bfYmca.toFixed(1) + "%";
            bfBmiVal.textContent = bfBmi.toFixed(1) + "%";
        } else {
            // Fallback: only BMI-based is active
            bodyFatPercent = bfBmi;
            
            // Set individual displays
            bfNavyVal.textContent = "Tape Required";
            bfYmcaVal.textContent = "Tape Required";
            bfBmiVal.textContent = bfBmi.toFixed(1) + "%";
        }

        // Clamp Body Fat realistic limits
        bodyFatPercent = Math.max(2, Math.min(60, bodyFatPercent));
        
        // Fat & Lean Mass calculation
        const fatMassKg = weightKg * (bodyFatPercent / 100);
        const leanMassKg = weightKg - fatMassKg;
        
        // Body Fat Category (ACE standard guidelines)
        let bfCategory = "Average";
        if (gender === 'male') {
            if (bodyFatPercent < 6) bfCategory = "Essential Fat";
            else if (bodyFatPercent < 14) bfCategory = "Athletes";
            else if (bodyFatPercent < 18) bfCategory = "Fitness";
            else if (bodyFatPercent < 25) bfCategory = "Average";
            else bfCategory = "Obese";
        } else {
            if (bodyFatPercent < 14) bfCategory = "Essential Fat";
            else if (bodyFatPercent < 21) bfCategory = "Athletes";
            else if (bodyFatPercent < 25) bfCategory = "Fitness";
            else if (bodyFatPercent < 32) bfCategory = "Average";
            else bfCategory = "Obese";
        }

        // --- View Model Mapping ---
        
        // BMI Category & Styling
        let category = '';
        let indicatorClass = 'normal';
        let adviceText = '';
        let adviceTitle = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
            indicatorClass = 'underweight';
            adviceTitle = 'Weight Increase Recommended';
            adviceText = 'Your BMI is in the underweight range. Focus on nutrient-dense foods, high-quality proteins, and progressive resistance training to gain lean mass safely. Consider consulting a health professional.';
        } else if (bmi >= 18.5 && bmi < 25.0) {
            category = 'Normal Weight';
            indicatorClass = 'normal';
            adviceTitle = 'Optimal Physical Status';
            adviceText = 'Your BMI indicates a healthy body composition. Maintain a balanced diet rich in whole foods, hit your daily protein requirements, and keep up your physical routine to preserve lean mass.';
        } else if (bmi >= 25.0 && bmi < 30.0) {
            category = 'Overweight';
            indicatorClass = 'warning';
            adviceTitle = 'Mild Caloric Deficit Recommended';
            adviceText = 'Your BMI is classified as overweight. A mild daily calorie deficit combined with consistent cardiovascular exercise and strength training can support steady fat loss while retaining muscle tissue.';
        } else {
            category = 'Obese';
            indicatorClass = 'danger';
            adviceTitle = 'Structured Calorie Management Advised';
            adviceText = 'Your BMI falls into the obesity range. Structured calorie tracking, reduction of processed carbohydrates, daily walking, and professional advice can significantly lower metabolic and cardiovascular risk factors.';
        }

        // Show Results container
        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        
        // Set values
        bmiScoreText.textContent = bmi.toFixed(1);
        bmiCategoryText.textContent = category;
        
        // Body composition card
        bodyfatCategoryText.textContent = bfCategory;
        bodyfatMethodBadge.textContent = bfMethodName;
        bodyfatPercentText.textContent = bodyFatPercent.toFixed(1);
        leanPercentText.textContent = (100 - bodyFatPercent).toFixed(1);
        
        // Dynamic bar widths
        fatMassBar.style.width = `${bodyFatPercent}%`;
        leanMassBar.style.width = `${100 - bodyFatPercent}%`;
        
        if (system === 'metric') {
            fatMassVal.textContent = fatMassKg.toFixed(1);
            fatMassUnit.textContent = 'kg';
            leanMassVal.textContent = leanMassKg.toFixed(1);
            leanMassUnit.textContent = 'kg';
            
            idealWeightValue.textContent = idealWeightKg.toFixed(1);
            idealWeightUnit.textContent = 'kg';
        } else {
            const fatMassLbs = fatMassKg * 2.20462;
            const leanMassLbs = leanMassKg * 2.20462;
            fatMassVal.textContent = fatMassLbs.toFixed(1);
            fatMassUnit.textContent = 'lbs';
            leanMassVal.textContent = leanMassLbs.toFixed(1);
            leanMassUnit.textContent = 'lbs';
            
            const idealWeightLbs = idealWeightKg * 2.20462;
            idealWeightValue.textContent = idealWeightLbs.toFixed(1);
            idealWeightUnit.textContent = 'lbs';
        }
        
        bmrValue.textContent = Math.round(bmr).toLocaleString();
        tdeeValue.textContent = Math.round(tdee).toLocaleString();
        waterValue.textContent = waterLiters.toFixed(1);
        
        // Calorie Goal Card recommendations
        const minSafeCalorie = (gender === 'female') ? 1200 : 1500;
        const lossCalories = Math.max(minSafeCalorie, Math.round(tdee - 500));
        const gainCalories = Math.round(tdee + 500);
        
        calorieLossValue.textContent = lossCalories.toLocaleString();
        calorieMaintenanceValue.textContent = Math.round(tdee).toLocaleString();
        calorieGainValue.textContent = gainCalories.toLocaleString();
        
        // Set dynamic feedback
        feedbackIndicator.className = `indicator ${indicatorClass}`;
        feedbackTitle.textContent = adviceTitle;
        feedbackText.textContent = adviceText;

        // Position Gauge Pointer
        const minBmi = 15;
        const maxBmi = 40;
        let percentage = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
        percentage = Math.max(2, Math.min(98, percentage)); // Clamp it
        
        gaugePointer.style.left = `${percentage}%`;
    });

    // --- Gemini API & Settings Modal Security Logic ---
    
    // Selectors
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const passcodeToggle = document.getElementById('passcodeToggle');
    const pinSetupGroup = document.getElementById('pinSetupGroup');
    const pinInput = document.getElementById('pinInput');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    const unlockModal = document.getElementById('unlockModal');
    const unlockPinInput = document.getElementById('unlockPinInput');
    const pinErrorMessage = document.getElementById('pinErrorMessage');
    const submitPinBtn = document.getElementById('submitPinBtn');
    const cancelPinBtn = document.getElementById('cancelPinBtn');
    
    const generateAiBtn = document.getElementById('generateAiBtn');
    const aiContentPlaceholder = document.getElementById('aiContentPlaceholder');
    const aiContentBox = document.getElementById('aiContentBox');
    const aiLoadingBox = document.getElementById('aiLoadingBox');

    let currentDecryptedKey = "";
    
    // Simple XOR-based encryption/decryption
    function encrypt(text, key) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }
    
    function decrypt(cipher, key) {
        try {
            let text = atob(cipher);
            let result = "";
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch (e) {
            return "";
        }
    }

    // Load initial settings
    function loadApiKey() {
        const savedKey = localStorage.getItem('secure_gemini_key');
        const isLocked = localStorage.getItem('gemini_key_locked') === 'true';
        
        if (savedKey) {
            if (!isLocked) {
                // Key is saved in plain text
                currentDecryptedKey = savedKey;
                apiKeyInput.value = savedKey;
                passcodeToggle.checked = false;
                pinSetupGroup.classList.add('hidden');
            } else {
                // Key is locked. Do not fill the plain text key. Show placeholder.
                apiKeyInput.value = "";
                apiKeyInput.placeholder = "•••••••••••••••• (Locked)";
                passcodeToggle.checked = true;
                pinSetupGroup.classList.remove('hidden');
            }
        }
    }
    
    // Toggle PIN setup group
    passcodeToggle.addEventListener('change', () => {
        if (passcodeToggle.checked) {
            pinSetupGroup.classList.remove('hidden');
        } else {
            pinSetupGroup.classList.add('hidden');
            pinInput.value = "";
        }
    });
    
    // Open Settings Modal
    settingsBtn.addEventListener('click', () => {
        loadApiKey();
        settingsModal.classList.remove('hidden');
    });
    
    // Close Settings Modal
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    
    // Save Settings
    saveSettingsBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        const usePin = passcodeToggle.checked;
        
        if (!key && !apiKeyInput.placeholder.includes("Locked")) {
            localStorage.removeItem('secure_gemini_key');
            localStorage.removeItem('gemini_key_locked');
            localStorage.removeItem('gemini_key_check');
            currentDecryptedKey = "";
            settingsModal.classList.add('hidden');
            return;
        }
        
        if (usePin) {
            const pin = pinInput.value.trim();
            if (pin.length !== 4 || isNaN(pin)) {
                alert("Please enter a valid 4-digit numeric PIN.");
                return;
            }
            
            // If the user modified the key input field (meaning it's not locked placeholder)
            if (key) {
                const encryptedKey = encrypt(key, pin);
                const encryptedCheck = encrypt("VITALIFY", pin);
                
                localStorage.setItem('secure_gemini_key', encryptedKey);
                localStorage.setItem('gemini_key_check', encryptedCheck);
                localStorage.setItem('gemini_key_locked', 'true');
                currentDecryptedKey = key;
            } else {
                // If key is untouched (still locked) but user changed PIN
                const savedKey = localStorage.getItem('secure_gemini_key');
                if (savedKey) {
                    alert("To change the PIN, please re-enter your API key.");
                    return;
                }
            }
        } else {
            // Save plain text
            if (key) {
                localStorage.setItem('secure_gemini_key', key);
                localStorage.setItem('gemini_key_locked', 'false');
                localStorage.removeItem('gemini_key_check');
                currentDecryptedKey = key;
            }
        }
        
        settingsModal.classList.add('hidden');
        alert("Settings saved successfully.");
    });
    
    // AI insights trigger
    generateAiBtn.addEventListener('click', () => {
        const savedKey = localStorage.getItem('secure_gemini_key');
        const isLocked = localStorage.getItem('gemini_key_locked') === 'true';
        
        if (!savedKey) {
            alert("Please configure your Gemini API Key in Settings first.");
            settingsModal.classList.remove('hidden');
            return;
        }
        
        if (isLocked && !currentDecryptedKey) {
            // Need to unlock first
            unlockPinInput.value = "";
            pinErrorMessage.classList.add('hidden');
            unlockModal.classList.remove('hidden');
        } else {
            // Already unlocked or plain text
            runAiAnalysis(currentDecryptedKey || savedKey);
        }
    });
    
    // PIN Cancel
    cancelPinBtn.addEventListener('click', () => {
        unlockModal.classList.add('hidden');
    });
    
    // PIN Submit
    submitPinBtn.addEventListener('click', () => {
        const pin = unlockPinInput.value.trim();
        const savedKey = localStorage.getItem('secure_gemini_key');
        const savedCheck = localStorage.getItem('gemini_key_check');
        
        if (pin.length !== 4) {
            pinErrorMessage.textContent = "Please enter a 4-digit PIN.";
            pinErrorMessage.classList.remove('hidden');
            return;
        }
        
        // Decrypt check word
        const decryptedCheck = decrypt(savedCheck, pin);
        if (decryptedCheck === "VITALIFY") {
            currentDecryptedKey = decrypt(savedKey, pin);
            unlockModal.classList.add('hidden');
            runAiAnalysis(currentDecryptedKey);
        } else {
            pinErrorMessage.textContent = "Incorrect PIN. Please try again.";
            pinErrorMessage.classList.remove('hidden');
        }
    });
    
    async function runAiAnalysis(apiKey) {
        // Collect metrics to send to prompt
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = ageInput.value;
        const system = document.querySelector('input[name="unitSystem"]:checked').value;
        
        let heightStr = "";
        let weightStr = "";
        if (system === 'metric') {
            heightStr = heightCmInput.value + " cm";
            weightStr = weightKgInput.value + " kg";
        } else {
            heightStr = `${heightFtInput.value} ft ${heightInInput.value} in`;
            weightStr = weightLbsInput.value + " lbs";
        }
        
        const bmi = bmiScoreText.textContent;
        const bmiCat = bmiCategoryText.textContent;
        
        const bfPercent = bodyfatPercentText.textContent;
        const bfCat = bodyfatCategoryText.textContent;
        
        const bmr = bmrValue.textContent;
        const tdee = tdeeValue.textContent;
        const idealW = idealWeightValue.textContent + " " + document.getElementById('idealWeightUnit').textContent;
        const water = waterValue.textContent;
        
        const activitySelect = document.getElementById('activityInput');
        const activityText = activitySelect.options[activitySelect.selectedIndex].text;
        
        // Setup prompt
        const prompt = `You are a world-class clinical nutritionist and sports fitness coach. Provide customized insights based on these metrics:
Gender: ${gender}
Age: ${age}
Height: ${heightStr}
Weight: ${weightStr}
BMI: ${bmi} (${bmiCat})
Body Fat Percentage: ${bfPercent} (${bfCat})
Activity Level: ${activityText}
BMR: ${bmr} kcal/day
TDEE: ${tdee} kcal/day
Ideal Body Weight: ${idealW}
Daily Hydration Target: ${water} Liters

Provide your response in raw JSON format with the following exact keys:
{
  "diet": {
    "goal": "Brief goal statement",
    "target_calories": "Total daily calorie target (e.g. 2000 kcal/day)",
    "macros": { "carbs": "percentage (e.g. 45%)", "protein": "percentage (e.g. 30%)", "fats": "percentage (e.g. 25%)" },
    "meals": [
      { "name": "Breakfast", "food": "Hinglish diet recommendation", "calories": "approx kcal" },
      { "name": "Lunch", "food": "Hinglish diet recommendation", "calories": "approx kcal" },
      { "name": "Evening Snack", "food": "Hinglish diet recommendation", "calories": "approx kcal" },
      { "name": "Dinner", "food": "Hinglish diet recommendation", "calories": "approx kcal" }
    ],
    "hydration": "Daily hydration guidance"
  },
  "workout": {
    "split": "Weekly split overview",
    "target": "Target objective",
    "schedule": [
      { "day": "Day 1", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 2", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 3", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 4", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 5", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 6", "exercise": "Exercises", "target": "Target muscle/goal" },
      { "day": "Day 7", "exercise": "Exercises", "target": "Target muscle/goal" }
    ]
  },
  "forecast": {
    "trajectory": "Hinglish description of metabolic trajectory",
    "energy": "Hinglish description of daily energy stability",
    "risks": "Hinglish description of risk factor outlook"
  }
}

Your output must be ONLY valid JSON, with no markdown formatting backticks (like \`\`\`json) and no trailing commas. Do not write any preamble. All descriptions must be in professional Hinglish.`;

        // UI States
        aiContentPlaceholder.classList.add('hidden');
        aiContentBox.classList.add('hidden');
        aiLoadingBox.classList.remove('hidden');
        
        try {
            let response;
            let success = false;
            let lastError = "";
            
            const endpoints = [
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`
            ];
            
            for (let url of endpoints) {
                try {
                    response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }]
                        })
                    });
                    
                    if (response.ok) {
                        success = true;
                        break;
                    } else {
                        try {
                            const errJson = await response.json();
                            lastError = errJson.error.message || ("Status " + response.status);
                        } catch(e) {
                            lastError = "Status " + response.status;
                        }
                        console.warn(`Gemini endpoint failed: ${url}. Error: ${lastError}`);
                    }
                } catch (error) {
                    lastError = error.message;
                    console.warn(`Gemini endpoint network error: ${url}. Error: ${lastError}`);
                }
            }
            
            if (!success) {
                throw new Error("All endpoints failed. Last error: " + lastError + " (Please check browser console for details)");
            }
            
            const resultData = await response.json();
            const rawText = resultData.candidates[0].content.parts[0].text.trim();
            
            // Clean markdown blocks if returned
            let jsonText = rawText;
            if (jsonText.startsWith("```")) {
                jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            }
            
            const parsed = JSON.parse(jsonText);
            
            // Populate Calorie & Macro Goals
            document.getElementById('aiCalorieGoal').textContent = (parsed.diet && parsed.diet.target_calories) || "--";
            
            const macros = (parsed.diet && parsed.diet.macros) || {};
            const macroStr = `${macros.carbs || "--"} / ${macros.protein || "--"} / ${macros.fats || "--"}`;
            document.getElementById('aiMacroGoal').textContent = macroStr;
            
            // Populate Diet Table
            const dietTableBody = document.getElementById('aiDietTableBody');
            dietTableBody.innerHTML = "";
            const meals = (parsed.diet && parsed.diet.meals) || [];
            meals.forEach(meal => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid var(--card-border)";
                
                const tdName = document.createElement('td');
                tdName.style.padding = "10px 12px";
                tdName.style.fontWeight = "700";
                tdName.style.color = "var(--text-primary)";
                tdName.textContent = meal.name;
                
                const tdFood = document.createElement('td');
                tdFood.style.padding = "10px 12px";
                tdFood.style.lineHeight = "1.5";
                tdFood.textContent = meal.food;
                
                const tdCal = document.createElement('td');
                tdCal.style.padding = "10px 12px";
                tdCal.style.textAlign = "right";
                tdCal.style.fontWeight = "700";
                tdCal.style.color = "var(--primary)";
                tdCal.textContent = meal.calories;
                
                tr.appendChild(tdName);
                tr.appendChild(tdFood);
                tr.appendChild(tdCal);
                dietTableBody.appendChild(tr);
            });
            
            document.getElementById('aiHydrationText').innerHTML = `<strong>Hydration Plan:</strong> ${(parsed.diet && parsed.diet.hydration) || "Minimum 2.5 - 3 Liters daily."}`;
            
            // Populate Workout Table
            const workoutTableBody = document.getElementById('aiWorkoutTableBody');
            workoutTableBody.innerHTML = "";
            const schedule = (parsed.workout && parsed.workout.schedule) || [];
            schedule.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid var(--card-border)";
                
                const tdDay = document.createElement('td');
                tdDay.style.padding = "10px 12px";
                tdDay.style.fontWeight = "700";
                tdDay.style.color = "var(--text-primary)";
                tdDay.textContent = item.day;
                
                const tdExercise = document.createElement('td');
                tdExercise.style.padding = "10px 12px";
                tdExercise.style.lineHeight = "1.5";
                tdExercise.textContent = item.exercise;
                
                const tdTarget = document.createElement('td');
                tdTarget.style.padding = "10px 12px";
                tdTarget.style.fontWeight = "600";
                tdTarget.style.color = "var(--accent-teal)";
                tdTarget.textContent = item.target;
                
                tr.appendChild(tdDay);
                tr.appendChild(tdExercise);
                tr.appendChild(tdTarget);
                workoutTableBody.appendChild(tr);
            });
            
            // Populate Forecast Section
            document.getElementById('aiForecastTrajectory').textContent = (parsed.forecast && parsed.forecast.trajectory) || "";
            document.getElementById('aiForecastEnergy').textContent = (parsed.forecast && parsed.forecast.energy) || "";
            document.getElementById('aiForecastRisks').textContent = (parsed.forecast && parsed.forecast.risks) || "";
            
            aiLoadingBox.classList.add('hidden');
            aiContentBox.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            aiLoadingBox.classList.add('hidden');
            aiContentPlaceholder.classList.remove('hidden');
            aiContentPlaceholder.innerHTML = `<p style="color: var(--accent-red); font-weight: 600;">Failed to generate AI insights. Error: ${error.message}. Please check your API Key and network connection.</p>`;
        }
    }
});

