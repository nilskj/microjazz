# Microjazz module player
This is a wrapper with typedefs for https://github.com/electronoora/webaudio-mod-player.
basically some minor changes and formatting, packaged to be easier to use.

## How to use
Instead of dealing with script tags and imports this module can be installed with npm:

`npm install microjazz`


Provide a file url that you would like to load. If using a bundler you can put the tunes in /static or /public (ex for Vite) folder to fetch them.

```javascript
    import { ModPlayer } from "microjazz"

    const player = new ModPlayer()
    player.load("awesome-chiptune.mod")
    player.onReady = () => {
        player.play()
    }
```
It is callback based with XMLHTTPRequest just like the original implementation from @eletronoora

## Contributing
Feel free to open a PR and contribute! If you know how to convert to using Audio Worklets that would be amazing.

Thanks again to original author https://github.com/electronoora!