// S3 Storage Classes Simulator
class S3StorageSimulator {
    constructor() {
        this.files = [];
        this.nextFileId = 1;
        this.currentDay = 0;
        this.lifecyclePolicy = {
            enableIA: true,
            iaDays: 30,
            enableGlacier: true,
            glacierDays: 90,
            enableDeepArchive: true,
            deepArchiveDays: 365,
            enableDeletion: false,
            deletionDays: 2555
        };
        
        this.storageCosts = {
            standard: 0.023,
            ia: 0.0125,
            glacier: 0.004,
            'deep-archive': 0.00099
        };
        
        this.retrievalCosts = {
            standard: 0,
            ia: 0.01,
            glacier: 0.03,
            'deep-archive': 0.02
        };
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Code tab buttons
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCodeTab(e.target.dataset.tab);
            });
        });
    }

    uploadFile() {
        const fileName = document.getElementById('file-name').value.trim();
        const fileSize = parseInt(document.getElementById('file-size').value);

        if (!fileName) {
            alert('Please enter a file name');
            return;
        }

        const file = {
            id: this.nextFileId++,
            name: fileName,
            size: fileSize,
            storageClass: 'standard',
            uploadDate: new Date(),
            daysSinceUpload: 0,
            totalCost: 0,
            retrievalTime: 'Instant'
        };

        this.files.push(file);
        this.updateDisplay();
        this.logAction(`Uploaded ${fileName} (${fileSize} MB) to S3 Standard`);

        // Clear input
        document.getElementById('file-name').value = '';
    }

    simulateLifecycle() {
        if (this.files.length === 0) {
            alert('Please upload some files first');
            return;
        }

        this.logAction('Simulating 30-day lifecycle progression...');
        
        // Simulate 30 days passing
        this.currentDay += 30;
        
        this.files.forEach(file => {
            file.daysSinceUpload += 30;
            this.applyLifecycleTransitions(file);
        });

        this.updateTimeline();
        this.updateDisplay();
        this.logAction(`Advanced to day ${this.currentDay}`);
    }

    applyLifecycleTransitions(file) {
        const days = file.daysSinceUpload;
        let transitioned = false;

        if (this.lifecyclePolicy.enableDeepArchive && 
            days >= this.lifecyclePolicy.deepArchiveDays && 
            file.storageClass !== 'deep-archive') {
            file.storageClass = 'deep-archive';
            file.retrievalTime = '12 hours';
            this.logAction(`${file.name} transitioned to Deep Archive`);
            transitioned = true;
        } else if (this.lifecyclePolicy.enableGlacier && 
                   days >= this.lifecyclePolicy.glacierDays && 
                   file.storageClass !== 'glacier' && 
                   file.storageClass !== 'deep-archive') {
            file.storageClass = 'glacier';
            file.retrievalTime = '1-5 minutes';
            this.logAction(`${file.name} transitioned to Glacier`);
            transitioned = true;
        } else if (this.lifecyclePolicy.enableIA && 
                   days >= this.lifecyclePolicy.iaDays && 
                   file.storageClass === 'standard') {
            file.storageClass = 'ia';
            file.retrievalTime = 'Instant';
            this.logAction(`${file.name} transitioned to Standard-IA`);
            transitioned = true;
        }

        if (transitioned) {
            this.calculateFileCost(file);
        }
    }

    calculateFileCost(file) {
        const monthsStored = file.daysSinceUpload / 30;
        const sizeInGB = file.size / 1024; // Convert MB to GB
        const storageCost = this.storageCosts[file.storageClass] * sizeInGB * monthsStored;
        file.totalCost = storageCost;
    }

    retrieveFile() {
        if (this.files.length === 0) {
            alert('No files to retrieve');
            return;
        }

        // Get a random file to retrieve
        const file = this.files[Math.floor(Math.random() * this.files.length)];
        const retrievalCost = this.retrievalCosts[file.storageClass] * (file.size / 1024);
        
        this.logAction(`Retrieving ${file.name} from ${file.storageClass.toUpperCase()}`);
        this.logAction(`Retrieval time: ${file.retrievalTime}`);
        this.logAction(`Retrieval cost: $${retrievalCost.toFixed(4)}`);

        // Simulate retrieval process
        if (file.storageClass === 'glacier') {
            this.simulateRetrievalProcess(file, '1-5 minutes', 5000);
        } else if (file.storageClass === 'deep-archive') {
            this.simulateRetrievalProcess(file, '12 hours', 15000);
        } else {
            this.logAction(`${file.name} retrieved instantly`);
        }
    }

    simulateRetrievalProcess(file, timeText, duration) {
        this.logAction(`Initiating retrieval process for ${file.name}...`);
        
        setTimeout(() => {
            this.logAction(`${file.name} retrieval completed after ${timeText}`);
        }, duration);
    }

    deleteFile() {
        if (this.files.length === 0) {
            alert('No files to delete');
            return;
        }

        const file = this.files.pop();
        this.logAction(`Deleted ${file.name} from ${file.storageClass.toUpperCase()}`);
        this.updateDisplay();
    }

    resetSimulation() {
        this.files = [];
        this.nextFileId = 1;
        this.currentDay = 0;
        this.updateDisplay();
        this.updateTimeline();
        this.logAction('Simulation reset');
    }

    calculateCosts() {
        const size = parseFloat(document.getElementById('calc-size').value);
        const duration = parseFloat(document.getElementById('calc-duration').value);

        if (!size || !duration) {
            alert('Please enter valid size and duration');
            return;
        }

        const results = [];
        let cheapest = null;
        let lowestCost = Infinity;

        Object.keys(this.storageCosts).forEach(storageClass => {
            const monthlyCost = this.storageCosts[storageClass] * size;
            const totalCost = monthlyCost * duration;
            
            results.push({
                class: storageClass,
                monthlyCost: monthlyCost,
                totalCost: totalCost
            });

            if (totalCost < lowestCost) {
                lowestCost = totalCost;
                cheapest = storageClass;
            }
        });

        this.displayCostResults(results, cheapest);
    }

    displayCostResults(results, cheapest) {
        const container = document.getElementById('cost-results');
        
        container.innerHTML = results.map(result => {
            const isLowest = result.class === cheapest;
            const className = result.class.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return `
                <div class="cost-result ${isLowest ? 'cheapest' : ''}">
                    <div class="cost-class">${className}</div>
                    <div class="cost-amount">$${result.totalCost.toFixed(2)}</div>
                    <div style="font-size: 0.8rem; color: #666;">
                        $${result.monthlyCost.toFixed(3)}/month
                    </div>
                    ${isLowest ? '<div style="color: #38a169; font-weight: bold; margin-top: 5px;">💰 Cheapest</div>' : ''}
                </div>
            `;
        }).join('');
    }

    applyLifecyclePolicy() {
        // Get policy settings from form
        this.lifecyclePolicy = {
            enableIA: document.getElementById('enable-ia').checked,
            iaDays: parseInt(document.getElementById('ia-days').value),
            enableGlacier: document.getElementById('enable-glacier').checked,
            glacierDays: parseInt(document.getElementById('glacier-days').value),
            enableDeepArchive: document.getElementById('enable-deep-archive').checked,
            deepArchiveDays: parseInt(document.getElementById('deep-archive-days').value),
            enableDeletion: document.getElementById('enable-deletion').checked,
            deletionDays: parseInt(document.getElementById('deletion-days').value)
        };

        this.logAction('Lifecycle policy updated');
        
        // Apply policy to existing files
        this.files.forEach(file => {
            this.applyLifecycleTransitions(file);
        });
        
        this.updateDisplay();
    }

    updateDisplay() {
        // Update file counts
        const counts = {
            standard: 0,
            ia: 0,
            glacier: 0,
            'deep-archive': 0
        };

        this.files.forEach(file => {
            counts[file.storageClass]++;
        });

        document.getElementById('standard-count').textContent = counts.standard;
        document.getElementById('ia-count').textContent = counts.ia;
        document.getElementById('glacier-count').textContent = counts.glacier;
        document.getElementById('deep-archive-count').textContent = counts['deep-archive'];

        // Update active storage class
        document.querySelectorAll('.storage-class').forEach(el => {
            el.classList.remove('active');
        });

        // Highlight storage classes with files
        Object.keys(counts).forEach(storageClass => {
            if (counts[storageClass] > 0) {
                document.querySelector(`[data-class="${storageClass}"]`).classList.add('active');
            }
        });

        // Update files display
        this.updateFilesDisplay();
    }

    updateFilesDisplay() {
        const container = document.getElementById('files-container');
        
        if (this.files.length === 0) {
            container.innerHTML = '<div class="no-files">No files uploaded yet. Upload a file to get started!</div>';
            return;
        }

        container.innerHTML = this.files.map(file => {
            this.calculateFileCost(file);
            const storageClassName = file.storageClass.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return `
                <div class="file-item ${file.storageClass}">
                    <div class="file-name">${file.name}</div>
                    <div class="file-details">
                        <span>${file.size} MB</span>
                        <span>${file.daysSinceUpload} days old</span>
                    </div>
                    <div class="file-storage-class">${storageClassName}</div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                        Retrieval: ${file.retrievalTime}<br>
                        Total cost: $${file.totalCost.toFixed(4)}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateTimeline() {
        const markers = document.querySelectorAll('.timeline-marker');
        
        markers.forEach(marker => {
            const day = parseInt(marker.dataset.day);
            const dot = marker.querySelector('.marker-dot');
            
            if (this.currentDay >= day) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (this.currentDay + 30 >= day && this.currentDay < day) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
    }

    switchCodeTab(tabName) {
        // Update active tab
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show corresponding code
        document.querySelectorAll('.code-content pre').forEach(pre => {
            pre.style.display = 'none';
        });
        document.getElementById(`${tabName}-code`).style.display = 'block';
    }

    logAction(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${message}`);
    }
}

// Global functions for HTML onclick handlers
let s3Simulator;

function uploadFile() {
    s3Simulator.uploadFile();
}

function simulateLifecycle() {
    s3Simulator.simulateLifecycle();
}

function retrieveFile() {
    s3Simulator.retrieveFile();
}

function deleteFile() {
    s3Simulator.deleteFile();
}

function resetSimulation() {
    s3Simulator.resetSimulation();
}

function calculateCosts() {
    s3Simulator.calculateCosts();
}

function applyLifecyclePolicy() {
    s3Simulator.applyLifecyclePolicy();
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    s3Simulator = new S3StorageSimulator();
    
    console.log('=== AWS S3 Storage Classes Simulator ===');
    console.log('Standard: $0.023/GB - Instant access, frequent use');
    console.log('Standard-IA: $0.0125/GB - Instant access, infrequent use');
    console.log('Glacier: $0.004/GB - 1-5 min retrieval, archival');
    console.log('Deep Archive: $0.00099/GB - 12 hour retrieval, long-term');
    console.log('=== Upload files and simulate lifecycle policies! ===');
});