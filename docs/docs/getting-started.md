# Getting started
> Takahoot is a solution made of one or many physical targets behaving as kahoot sessions to answer a specific quizz using nerf or BB guns.

There are 3 components you need to know about:
 * The Targets, which are split into 4 colored hit-zones and one control panel
 * Kahoot [kahoot.com](https://kahoot.com) which is where you will design your Quizz and run it
 * The Takahoot Client, which allows you to use and configure the targets so that they can be used for your Quizz.

## Client

Execute the latest binary release of Takahoot for your platform (Windows, Mac OSX or Linux).
Binaries can be downloaded [here](https://github.com/resourcepool/takahoot/releases).

### About the Control Panel

Your control panel has one button, one knob, and three leds.

**The button**    
The button is the calibration-button. Pushing it will launch a target-calibration cycle (for about 10 seconds).
Do not touch your target while the calibration is ongoing.

**The knob**  
The knob is used to adjust the sensitivity of your target. Turning it clockwise will make your target **less** sensitive to hits. 

**The LEDs**  
Your target LEDs are used to give you feedback on your hits and the state of your target.

(R: red led, Y: yellow led, G: green led)

- RGY ON: target recognized by client
- RGY BLINKING: pairing started
- R ON: calibration in progress
- Y ON: waiting for a hit
- G ON: target hit

NB: when a hit is detected on your target, it reaches the end of its cycle. That means that as long as you have not gone to the next question, only one hit (<=> answer) will be accepted on the target.
When players switch to the following question in the quizz, the targets are automatically reset to `Y ON: waiting for a hit`


## Setup

`In this example, we consider that you have 4 targets. Rest assured that Takahoot can be used with any number of targets (from 1 to as much as you want).`

### Connect your 4 targets to a USB hub on your computer

TODO: Photo of the USB Hub with the targets

### Run the Kahoot client and configure targets

Click on **Configuration**.
You should see your targets (If they don't show up, make sure they are connected and recognized by your Operating System).

Your targets will go through this process :
 1. Initialization: the leads on the control panel of your targets should be ON
 2. Pairing: select and assign each physical target to its equivalent in the software. You will know which target is currently being paired by seeing all three LEDs blinking (USBs don't have orders, there is no way for you to know which target is the one on the left or on the right if you don't go through this step). 
 3. Calibration: the Red LED should be on for about 10 seconds. Your targets will go through hardware-calibration. Do not touch your device during this process.
 4. Sensitivity: you might have to manually adjust the sensitivity of each target. In order to do this, you can go in **Test Mode** and manually check that the targets respond according to your expectations.
  

## Playing the game

`Make sure you have configured your targets before playing a game.`

 1. Go to the main game interface : configured targets should appear. 
 2. Launch a kahoot session and get your game ID (a number)
 3. Paste the game id in the Client and start the game!
 4. Players should appear as active in the Kahoot Game session
 5. The game should start automatically and follow the Kahoot Quizz questions
 6. When the game is over, you can either stop the game and go back to the main menu, or start over the same game.

    
## Troubleshooting


