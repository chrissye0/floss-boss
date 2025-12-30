# Floss-boss
New Media Interactive Development &amp; New Media Design Capstone 2025-2026. The official website can be found [here](https://flossboss.framer.website/). 

Our GDC submission video can be found [here](https://www.youtube.com/watch?v=3P0t6EmyHPo&feature=youtu.be). 

## Pitch
Step into the tiny shoes of a shrimp, tasked with cleaning the enormous teeth of a monstrous lake creature. Wield a giant toothbrush and floss pick to clean the most plaque off before time runs out!

## Overview

### Light Sensing + Capacitive Sensing
We utilize light sensing on the teeth. The toothbrush has lights, and each tooth contains a photoresistor. As the player brushes a tooth, the sensors detect which tooth is being brushed and display the corresponding interaction in the game. Brushing functionality is nearly complete.

We are currently developing flossing mechanics, which use capacitive sensing between the teeth. When the player performs the flossing motion, the sensors will detect which teeth are being flossed and display the interaction in the game.

We use data plotter charts to calibrate both the light and capacitive sensors. These charts provide real-time numerical feedback, allowing us to set accurate thresholds based on the environment and ensure responsive gameplay for brushing and flossing motions.

### Tools 
Large object controllers are used to manage the digital interactions, including a giant toothbrush and floss pick. In the current iteration, each tooth contains a photoresistor that detects light emitted from the LEDs in the toothbrush. When the brush is close to a tooth, the photoresistor senses the light, enabling the brushing interaction in the game. 

We are currently developing flossing, which will use capacitive sensing between the teeth to detect flossing motions.

### Gameplay
We use large, physical teeth models along with an oversized toothbrush and floss for the game. Animations on the screen will indicate if a tooth needs to be cleaned or is actively being cleaned. When the user is not actively cleaning, bacteria would regenerate or multiply, and plaque on the teeth would slowly spread to neighboring teeth. A user must balance the different methods of cleaning to achieve a clean mouth within the time limit.

Upon reaching the time limit, a user would receive a score based on the cleanliness of the mouth. If a player were to fully clean the teeth before time runs out, they would receive bonus points based on the remaining time. Total time, score, and cumulative data across all players, and a leaderboard would be displayed on the result screen.


## Team
### Developers
* [Kashaf Ahmed](https://github.com/kashahmed04)
* [Christine Espeleta](https://github.com/chrissye0)
* [Melodie Wang](https://github.com/kestrelw)
* [Nemesis Velazquez](https://github.com/nemeav)
### Designers
* Zane London
* Dayne Stein
* Noa Spanier
* Irene Tu
* Danielle Antonacci
* Maya Probeck
