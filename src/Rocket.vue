<template>
  <div class="outerWrapper">
    <div class="template" :style="wrapperStyle">
      <div :class="baseClasses">
        <div @click="launch" class="rocket-body">
          <div class="roof-tip"></div>
          <div class="window"></div>
          <div class="wing wing-1"></div>
          <div class="wing wing-2"></div>
          <div class="engine">
            <div class="fire"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons" @mouseenter="hover=true" @mouseleave="hover=false">
      <button
        v-if="canInstallAutopilot"
        :title="`Cost: $${autopilotCost}`"
        :disabled="money < autopilotCost"
        :style="{visibility: hover ? 'visible' : 'hidden'}"
        @click="installAutopilot"
        class="autopilot">
        +Auto
      </button>

      <button
        :title="`Cost: $${upgradeCost}`"
        :disabled="money < upgradeCost"
        :style="{visibility: hover ? 'visible' : 'hidden'}"
        @click="upgrade"
        class="upgrade">
        +Size
      </button>

      <div class="level">
        {{ rocket.level }}
      </div>
    </div>
  </div>
</template>
<script>
  import Rocket from './Rocket.js';

  export default {
    props: ['rocket', 'money', 'research'],
    data() {
      return {
        launched: false,
        hover: false
      };
    },
    watch: {
      rocket(newRocket, oldRocket) {
        if (newRocket.autopilot && !oldRocket.autopilot) {
          this.launch();
        }
      }
    },
    computed: {
      wrapperStyle() {
        const height = 350 + 100 * (this.rocket.level - 1);
        const bottomOffset = (this.rocket.level - 1) * 10;
        return {
          height: `${height}px`,
          // bottom: `-${bottomOffset}px`
        };
      },
      baseClasses() {
        const classes = ['base'];
        if (this.launched) {
          classes.push('base--launched');
        }
        return classes;
      },
      upgradeCost() {
        const rocket = Rocket(this.rocket);
        return rocket.upgradeCost();
      },
      canInstallAutopilot() {
        if (this.research.autopilot !== 100) return false;

        const rocket = Rocket(this.rocket);
        return rocket.canInstallAutopilot();
      },
      autopilotCost() {
        const rocket = Rocket(this.rocket);
        return rocket.autopilotCost();
      }
    },
    methods: {
      launch() {
        if (this.launched) return;

        this.launched = true;
        setTimeout(() => {
          this.$emit('launched');
        }, 2200);
        setTimeout(() => {
          this.launched = false;

          if (this.rocket.autopilot) {
            setTimeout(() => {
              this.launch();
            }, 1000);
          }
        }, 2500);
      },
      upgrade() {
        this.$emit('upgrade');
      },
      installAutopilot() {
        this.$emit('installAutopilot');
      }
    },
    mounted() {
      if (this.rocket.autopilot) {
        this.launch();
      }
    }
  };
</script>
<style scoped lang="scss">
  .outerWrapper {
    flex: 1 0;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    height: 160px;
    width: 60%;

    button {
      font-size: 28px;
      margin: 5px 3px;
    }
  }

  .level {
    margin-top: 10px;
    font-weight: bold;
    font-size: 20px;
  }

  .template {
    width: 100%;
    position: relative;
  }

  .template .base {
    width: 100%;
    height: 100%;
    position: relative;

    &--launched {
      /*-webkit-animation-delay: 1s;*/
      -webkit-animation-name: levitate;
      -webkit-animation-duration: 5s;
    }
  }

  /* -----------------------------
      Rocket
    -------------------------------
  */


  .template .rocket-body {
    width: 20%;
    height: 40%;
    background: white;
    border-radius: 40px;
    position: absolute;
    left: 50%;
    bottom: -10%;
    transform: translateX(-50%);
    transition: transform .2s;
    cursor: pointer;

    &:hover {
      transform: translateX(-50%) scale(1.15);
    }
  }

  /* -- Tip & Window -- */

  .template .rocket-body .roof-tip {
    width: 2px;
    height: 30px;
    background: rgba(0, 0, 0, .2);
    position: absolute;
    left: 50%;
    top: -22%;
    transform: translateX(-50%);
  }

  .template .rocket-body .roof-tip::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: #2196F3;
    border-radius: 50%;
    position: absolute;
    transform: translateX(-40%);
  }

  .window {
    width: 45%;
    height: 30%;
    background: #2196F3;
    border-radius: 50%;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
  }

  /* -- Wings --- */

  .template .rocket-body .wing {
    width: 40%;
    height: 40%;
    background: rgb(230, 32, 32);
    position: absolute;
  }

  .template .rocket-body .wing-1 {
    bottom: 0;
    left: -41%;
    border-top-left-radius: 100px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 120px;
  }

  .template .rocket-body .wing-2 {
    bottom: 0;
    right: -41%;
    border-top-right-radius: 100px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 120px;
  }

  /* --- Engine --- */

  .template .engine {
    width: 40%;
    height: 20%;
    background: rgb(243, 155, 56);
    border-radius: 50%;
    position: absolute;
    left: 50%;
    bottom: -20%;
    transform: translateX(-50%);
  }

  .template .engine .fire {
    width: 95%;
    height: 80%;
    background: rgb(243, 155, 56);
    -webkit-clip-path: polygon(50% 100%, 0 0, 100% 0);
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    position: absolute;
    bottom: -50%;
    left: 50%;
    transform: translateX(-50%);
    -webkit-animation: secondfire 0.01s infinite;
    animation: secondfire 0.01s infinite;
  }

  @keyframes levitate {
    0% {
      top: 0;
    }
    20% {
      top: calc(-100vh - 50%);
      opacity: 0;
    }
    40% {
      top: calc(100vh + 50%);
      opacity: 0;
    }

    50% {
      top: 0;
      opacity: 1;
    }
  }


  @keyframes secondfire {
    0% {
      bottom: -50%;
    }

    20% {
      bottom: -35%;
    }
  }
</style>
