class Traffic {
    constructor(initialSignal, trafficLightController) {
        this.currentSignal = initialSignal;
        this.listeners = [];

        trafficLightController.subscribe((currentSignal) => {
            this.currentSignal = currentSignal;
           
            this.listeners.forEach(check => check());
        });
    }

    async go(direction) {
        const canGo = () => {
            if (this.currentSignal === 'RED') return false;
            if (this.currentSignal === 'GREEN' && direction === 'FORWARD') return true;
            if (this.currentSignal === 'LEFT' && direction === 'LEFT') return true;
            if (this.currentSignal === 'RIGHT' && direction === 'RIGHT') return true;
            return false;
        };

    
        if (canGo()) return;

        await new Promise((resolve) => {
            const check = () => {
                if (canGo()) {
                    this.listeners = this.listeners.filter(l => l !== check);
                    resolve();
                }
            };
            this.listeners.push(check);
        });
    }
}

exports.Traffic = Traffic;
