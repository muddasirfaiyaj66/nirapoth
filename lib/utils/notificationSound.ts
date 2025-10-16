/**
 * Notification Sound Manager
 * Plays sounds for different types of notifications
 */

class NotificationSoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    // Don't create context immediately to avoid autoplay policy issues
  }

  /**
   * Initialize audio context (call after user interaction)
   */
  async initialize(): Promise<void> {
    if (this.initialized || typeof window === "undefined") return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.initialized = true;
      console.log("🔊 Audio context initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  /**
   * Enable/disable notification sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("notificationSoundsEnabled", enabled.toString());
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("notificationSoundsEnabled");
      if (stored !== null) {
        return stored === "true";
      }
    }
    return this.enabled;
  }

  /**
   * Play notification sound using Web Audio API
   */
  private async playTone(
    frequency: number,
    duration: number,
    volume: number = 0.3
  ): Promise<void> {
    if (!this.isEnabled()) return;

    // Auto-initialize if not already done
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.audioContext) return;

    try {
      // Resume context if suspended
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }

  /**
   * Play normal notification sound
   */
  async playNormalNotification(): Promise<void> {
    if (!this.isEnabled()) return;
    await this.playTone(800, 0.15, 0.2);
  }

  /**
   * Play urgent notification sound (more attention-grabbing)
   */
  async playUrgentNotification(): Promise<void> {
    if (!this.isEnabled()) return;

    // Play three ascending tones for urgency
    await this.playTone(600, 0.1, 0.3);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.playTone(800, 0.1, 0.3);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.playTone(1000, 0.2, 0.35);
  }

  /**
   * Play emergency/critical notification sound
   */
  async playEmergencyNotification(): Promise<void> {
    if (!this.isEnabled()) return;

    // Play alternating high-pitched tones for emergency
    for (let i = 0; i < 3; i++) {
      await this.playTone(1200, 0.15, 0.4);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await this.playTone(900, 0.15, 0.4);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  /**
   * Play success notification sound
   */
  async playSuccessNotification(): Promise<void> {
    if (!this.isEnabled()) return;
    await this.playTone(1000, 0.1, 0.25);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await this.playTone(1200, 0.15, 0.25);
  }

  /**
   * Play error notification sound
   */
  async playErrorNotification(): Promise<void> {
    if (!this.isEnabled()) return;
    await this.playTone(400, 0.2, 0.3);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.playTone(300, 0.2, 0.3);
  }

  /**
   * Play sound based on notification priority
   */
  async playByPriority(priority: string): Promise<void> {
    if (!this.isEnabled()) return;

    switch (priority) {
      case "URGENT":
        await this.playUrgentNotification();
        break;
      case "HIGH":
        await this.playUrgentNotification();
        break;
      case "NORMAL":
        await this.playNormalNotification();
        break;
      case "LOW":
        await this.playNormalNotification();
        break;
      default:
        await this.playNormalNotification();
    }
  }

  /**
   * Play sound based on notification type
   */
  async playByType(type: string, priority?: string): Promise<void> {
    if (!this.isEnabled()) return;

    // Priority takes precedence
    if (priority === "URGENT") {
      await this.playUrgentNotification();
      return;
    }

    switch (type) {
      case "ERROR":
        await this.playErrorNotification();
        break;
      case "SUCCESS":
      case "REPORT_APPROVED":
      case "APPEAL_APPROVED":
      case "REWARD_EARNED":
        await this.playSuccessNotification();
        break;
      case "WARNING":
      case "PENALTY_APPLIED":
      case "DEBT_CREATED":
        await this.playUrgentNotification();
        break;
      default:
        await this.playNormalNotification();
    }
  }

  /**
   * Test all sounds
   */
  async testSounds(): Promise<void> {
    console.log("Testing notification sounds...");

    console.log("Normal notification:");
    await this.playNormalNotification();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Urgent notification:");
    await this.playUrgentNotification();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Emergency notification:");
    await this.playEmergencyNotification();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Success notification:");
    await this.playSuccessNotification();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Error notification:");
    await this.playErrorNotification();

    console.log("Sound test complete!");
  }
}

// Create singleton instance
export const notificationSound = new NotificationSoundManager();

// Helper functions
export const initializeAudio = () => {
  return notificationSound.initialize();
};

export const playNotificationSound = (type: string, priority?: string) => {
  notificationSound.playByType(type, priority);
};

export const toggleNotificationSounds = (enabled: boolean) => {
  notificationSound.setEnabled(enabled);
};

export const isNotificationSoundEnabled = () => {
  return notificationSound.isEnabled();
};

export const testNotificationSounds = () => {
  notificationSound.testSounds();
};
