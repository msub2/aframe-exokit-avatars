# A-Frame Exokit Avatars

This A-Frame component provides an easy way to integrate a full-body IK avatar in WebXR through [my fork](https://github.com/msub2/avatars) of the [Exokit Avatars](https://github.com/exokitxr/avatars) system.

## Schema

| Property   | Type     | Description                                                      | Default Value |
| ---------- | -------- | ---------------------------------------------------------------- | ------------- |
| modelEl    | selector | An `<a-asset-item>` with an avatar model attached                |               |
| modelUrl   | string   | A local path or URL to an avatar model attached                  |               |
| player     | selector | An element representing the player/camera rig                    | #player       |
| head       | selector | An element representing the main camera of the scene             | #head         |
| leftHand   | selector | An element representing the tracked left hand                    | #leftHand     |
| rightHand  | selector | An element representing the tracked right hand                   | #rightHand    |
| fingers    | bool     | Whether or not to animate finger poses (point, grip)             | true          |
| hair       | bool     | Whether or not to animate hair                                   | true          |
| decapitate | bool     | Whether or not to remove the head of the model                   | false         |
| visemes    | bool     | Whether or not to animate visemes on the model (mouth, blinking) | true          |
| muted      | bool     | Whether or not to passthrough mic audio into the page.           | true          |
| debug      | bool     | Whether or not to render debug meshes.                           | false         |
