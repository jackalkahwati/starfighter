// Audio setup and preloading using Howler
import { Howl } from 'https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.module.js';

export function setupSounds() {
    const sounds = {};

    sounds.music = new Howl({
        src: ['./Future Synthwave MIDI Kits - MIDI Klowd - 01 Future Synthwave MIDI Kits - Demo.mp3'],
        loop: true,
        volume: 0.6,
        preload: true
    });

    const makeSound = (key, src, volume = 1.0) => {
        sounds[key] = new Howl({ src: [src], volume, preload: true, pool: 5 });
    };

    makeSound('laser_primary', './mixkit-cinematic-laser-gun-thunder-1287.wav', 0.8);
    makeSound('laser_twin', './mixkit-laser-weapon-shot-1681.wav', 0.8);
    makeSound('laser_plasma', './mixkit-sci-fi-battle-laser-shots-2783.wav', 1.0);
    makeSound('laser_rail', './569900__bigdino1995__explosion.wav', 0.9);
    makeSound('missile', './mixkit-cinematic-laser-swoosh-1467.wav', 0.8);
    makeSound('db_windup', './mixkit-cinematic-laser-swoosh-1467.wav', 1.0);
    makeSound('deathBlossom', './mixkit-cinematic-laser-swoosh-1467.wav', 1.0);
    makeSound('plasma_sputter', './mixkit-retro-video-game-bubble-laser-277.wav', 1.0);
    makeSound('directional_threat', './mixkit-sci-fi-battle-laser-shots-2783.wav', 1.0);
    makeSound('explosion_small', './569900__bigdino1995__explosion.wav', 1.0);
    makeSound('explosion_forge_split', './mixkit-shatter-shot-explosion-1693.wav', 1.0);
    makeSound('explosion_shield_node', './mixkit-dramatic-metal-explosion-impact-1687.wav', 1.0);
    makeSound('explosion_boss_core', './661799__robinhood76__11182-futuristing-collapse-explosion.wav', 1.0);
    makeSound('ui_lock_on', './mixkit-unlock-game-notification-253.wav', 1.0);
    makeSound('ui_beep', './mixkit-censorship-beep-1082.wav', 1.0);

    Object.keys(sounds).forEach(key => {
        sounds[key].on('loaderror', (id, err) => console.error(`${key} load error`, err));
        sounds[key].on('playerror', (id, err) => console.error(`${key} play error`, err));
    });

    return sounds;
}
