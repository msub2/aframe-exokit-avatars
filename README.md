# A-Frame Exokit Avatars

This A-Frame component provides an easy way to integrate a full-body IK avatar in WebXR through [my fork](https://github.com/msub2/avatars) of the [Exokit Avatars](https://github.com/exokitxr/avatars) system.

## Usage

The following is the most basic scene setup that will load in an avatar:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/aframe-exokit-avatars@1.0.2"></script>
    <title>A-Frame Exokit Avatars</title>
  </head>
  <body>
    <a-scene>
      <a-assets>
        <a-asset-item id="model" src="./dan.glb"></a-asset-item>
      </a-assets>
      <a-plane id="ground" rotation="-90 0 0" color="green" height="10" width="10"></a-plane>
      <a-light type="directional" intensity="0.5"></a-light>
      <a-light type="ambient" intensity="0.5"></a-light>
      <a-sky color="blue"></a-sky>
      <a-entity avatar="model: #model"></a-entity>
      <a-entity id="player">
        <a-camera id="head" near="0.1" wasd-controls look-controls></a-camera>
        <a-entity id="leftHand" tracked-controls="hand: left"></a-entity>
        <a-entity id="rightHand" tracked-controls="hand: right"></a-entity>
      </a-entity>
    </a-scene>
  </body>
</html>
```

## Considerations

- If implementing some form of touchpad or thumbstick movement, ensure your avatar is not parented under the player/camera rig object, as this will prevent the leg IK from functioning properly.
- By default, the `tracked-controls` component in A-Frame reports controller pose based on target ray space by default instead of grip space (refer to the [WebXR Device API](https://immersive-web.github.io/webxr/#dom-xrinputsource-targetrayspace) for more details). It's more than likely there might be some noticeable offset in the hand positions from where your controllers are. There is currently an [open PR](https://github.com/aframevr/aframe/pull/5040) to let grip space be used for pose reporting, but in the meantime you may want to apply some manual offset to your controller pose to compensate.

## Schema

| Property    | Type     | Description                                                      | Default Value |
| ----------- | -------- | ---------------------------------------------------------------- | ------------- |
| model       | model    | A selector or path to an avatar model                            |               |
| thirdPerson | boolean  | Whether this is an avatar for a different player than the user   | false         |
| player      | selector | An element representing the player/camera rig                    | #player       |
| head        | selector | An element representing the main camera of the scene             | #head         |
| leftHand    | selector | An element representing the tracked left hand                    | #leftHand     |
| rightHand   | selector | An element representing the tracked right hand                   | #rightHand    |
| fingers     | bool     | Whether or not to animate finger poses (point, grip)             | true          |
| hair        | bool     | Whether or not to animate hair                                   | true          |
| decapitate  | bool     | Whether or not to remove the head of the model                   | false         |
| visemes     | bool     | Whether or not to animate visemes on the model (mouth, blinking) | true          |
| muted       | bool     | Whether or not to passthrough mic audio into the page.           | true          |
| debug       | bool     | Whether or not to render debug meshes.                           | false         |
