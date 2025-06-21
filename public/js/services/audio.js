class AudioService {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.loadSounds();
    }
    
    loadSounds() {
        const soundFiles = {
            stone: window.CONSTANTS.AUDIO_FILES.STONE,
            enter: window.CONSTANTS.AUDIO_FILES.ENTER
        };
        
        Object.entries(soundFiles).forEach(([name, url]) => {
            this.sounds[name] = new Audio(url);
            this.sounds[name].volume = this.volume;
            this.sounds[name].preload = 'auto';
        });
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
        } catch (error) {
            console.warn('Audio error:', error);
        }
    }
    
    playStone() {
        this.play('stone');
    }
    
    playEnter() {
        this.play('enter');
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
}
