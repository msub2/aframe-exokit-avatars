import Avatar from 'exokit-avatars';

AFRAME.registerComponent('avatar', {
  schema: {
    // Selector or path for the model
    model: { type: 'model' },
    // Whether this is an avatar for a different player than the user
    thirdPerson: { type: 'bool', default: false },
    // Selector for the player/camera rig entity
    player: { type: 'selector', default: '#player' },
    // Selector for the main camera entity
    head: { type: 'selector', default: '#head' },
    // Selector for the tracked left controller entity
    leftHand: { type: 'selector', default: '#leftHand' },
    // Selector for the tracked right controller entity
    rightHand: { type: 'selector', default: '#rightHand' },
    // Animate fingers
    fingers: { type: 'bool', default: true },
    // Animate hair
    hair: { type: 'bool', default: true },
    // Whether to decapitate head
    decapitate: { type: 'bool', default: false },
    // Animate visemes (blink, mouth, etc.)
    visemes: { type: 'bool', default: true },
    // Whether to passthrough microphone audio
    muted: { type: 'bool', default: true },
    // Add debug bone geometry
    debug: { type: 'bool', default: false },
  },

  init: function () {
    if (!this.data.model) {
      console.error('No model was passed to the component!');
      return;
    }
    
    this.player = this.data.player;
    this.head = this.data.head;
    this.leftHand = this.data.leftHand;
    this.rightHand = this.data.rightHand;

    const handComponent = this.data.thirdPerson ? 'avatar-hand' : 'tracked-controls-webxr';

    this.leftHandControls = this.leftHand.components[handComponent];

    if (!this.leftHandControls) {
      // Use Mutation Observers to catch tracked-controls-webxr being set
      const leftWatcher = new MutationObserver(() => {
        this.leftHandControls = this.leftHand.components[handComponent];
        leftWatcher.disconnect();
      });
      leftWatcher.observe(this.leftHand, { attributes: true });
    }

    this.rightHandControls = this.rightHand.components[handComponent];

    if (!this.rightHandControls) {
      const rightWatcher = new MutationObserver(() => {
        this.rightHandControls = this.rightHand.components[handComponent];
        rightWatcher.disconnect();
      });
      rightWatcher.observe(this.rightHand, { attributes: true });
    }

    this.loadModel();
  },

  loadModel: async function () {
    const model = await new Promise((res, rej) => {
      new THREE.GLTFLoader().load(this.data.model, gltf => {
        gltf.frustumCulled = false;
        gltf.scene.traverse(o => {
          if (o.type === 'SkinnedMesh' || o.type === 'Mesh') {
            o.material.side = THREE.FrontSide;
            o.frustumCulled = false;
          }
        })
        AFRAME.scenes[0].object3D.add(gltf.scene);
        res(gltf);
      }, xhr => {}, rej);
    });

    const microphoneMediaStream = this.visemes || !this.muted ? await navigator.mediaDevices.getUserMedia({audio: true}) : undefined;
    this.avatar = new Avatar(model, { // model is the gltf object that includes the scene, can use https://github.com/exokitxr/model-loader
      fingers: this.data.fingers,
      hair: this.data.hair,
      decapitate: this.data.decapitate,
      visemes: this.data.visemes,
      microphoneMediaStream: microphoneMediaStream,
      muted: this.data.muted,
      debug: this.data.debug,
    });
  },

  tick: function (time, timeDelta) {
    if (!this.avatar) return;

    const playerOffset = this.player.object3D.position;
    this.avatar.inputs.hmd.position.copy(this.head.object3D.position.add(playerOffset));
    this.avatar.inputs.hmd.quaternion.copy(this.head.object3D.quaternion);
    this.avatar.inputs.leftGamepad.position.copy(this.leftHand.object3D.position.add(playerOffset));
    this.avatar.inputs.leftGamepad.quaternion.copy(this.leftHand.object3D.quaternion);
    this.avatar.inputs.rightGamepad.position.copy(this.rightHand.object3D.position.add(playerOffset));
    this.avatar.inputs.rightGamepad.quaternion.copy(this.rightHand.object3D.quaternion);
    
    if (!this.data.thirdPerson) {
      if (this.leftHandControls.buttonStates[0]) {
        this.avatar.inputs.leftGamepad.pointer = this.leftHandControls.buttonStates[0].value;
        this.avatar.inputs.leftGamepad.grip = this.leftHandControls.buttonStates[1].value;
      }
    
      if (this.rightHandControls.buttonStates[0]) {
        this.avatar.inputs.rightGamepad.pointer = this.rightHandControls.buttonStates[0].value;
        this.avatar.inputs.rightGamepad.grip = this.rightHandControls.buttonStates[1].value;
      }
    } else {
      if (this.leftHandControls) {
        this.avatar.inputs.leftGamepad.pointer = this.leftHandControls.data.pointer;
        this.avatar.inputs.leftGamepad.grip = this.leftHandControls.data.grip;
      }
    
      if (this.rightHandControls) {
        this.avatar.inputs.rightGamepad.pointer = this.rightHandControls.data.pointer;
        this.avatar.inputs.rightGamepad.grip = this.rightHandControls.data.grip;
      } 
    }

    this.avatar.setFloorHeight(0) // sets the floor height that exokit uses to determine the pose
 
    this.avatar.update();
  },

  remove: function () {
    AFRAME.scenes[0].object3D.remove(this.avatar.model);
  }
});

AFRAME.registerComponent('avatar-hand', {
  schema: {
    // Amount pointer finger is retracted
    pointer: { default: 0 },
    // Amount other fingers are retracted
    grip: { default: 0 }
  }
});