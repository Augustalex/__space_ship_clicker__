<template>
  <div id="app" :style="appStyle">
    <div class="top">
      <div class="research">
        <button v-if="!researching.autopilot" @click="researchAutopilot">Research Autopilot</button>
        <span v-else-if="research.autopilot < 100" class="research">
          <span class="research-bar" :style="{width: `${research.autopilot}%`}"></span>
        </span>
        <button v-else :disabled="true">Autopilot researched</button>
      </div>
      <button v-if="view !== 'launch'" @click="view = 'launch'" class="navigate-down">↓</button>
    </div>
    <div class="bottom">
      <button v-if="view !== 'research'" @click="view = 'research'" class="navigate-up">↑</button>
      <div class="toolbar">
        <button v-if="canBuyRocket" :disabled="money < 1000" @click="buyRocket">Rocket +1</button>
      </div>
      <div class="money">${{ money }}</div>
      <div class="rockets">
        <Rocket
          v-for="rocket in rockets"
          :rocket="rocket"
          :money="money"
          :research="research"
          @launched="launched(rocket)"
          @upgrade="upgrade(rocket)"
          @installAutopilot="installAutopilot(rocket)"/>
      </div>
    </div>
  </div>
</template>
<script>
  import RocketView from './Rocket.vue';
  import Rocket from './Rocket.js';

  export default {
    name: 'app',
    data() {
      return {
        view: 'launch',
        rockets: [{ level: 1 }],
        money: 100000,
        research: {
          autopilot: 0
        },
        researching: {
          autopilot: false
        }
      };
    },
    computed: {
      appStyle() {
        return {
          top: this.view === 'launch' ? '-100%' : '0'
        };
      },
      canBuyRocket() {
        return this.rockets.length < 20;
      }
    },
    methods: {
      launched(rocketData) {
        const rocket = Rocket(rocketData);
        this.money += rocket.launchReward();
      },
      upgrade(rocketData) {
        this.updateRocket(rocketData, rocket => {
          this.money -= rocket.upgradeCost();
          rocket.upgrade();
        });
      },
      installAutopilot(rocketData) {
        this.updateRocket(rocketData, rocket => {
          this.money -= rocket.autopilotCost();
          rocket.installAutopilot();
        });
      },
      buyRocket() {
        this.money -= 1000;
        let rocket = Rocket({ level: 1 });
        this.rockets.push(rocket.normalize());
      },
      updateRocket(rocketData, updateFn) {
        const rocket = Rocket(rocketData);
        updateFn(rocket);

        const index = this.rockets.findIndex(rocket => rocket.id === rocketData.id);
        this.rockets.splice(index, 1, rocket.normalize());
      },
      researchAutopilot() {
        this.researching.autopilot = true;
        const intervalId = setInterval(() => {
          this.research.autopilot = Math.min(100, this.research.autopilot + 1);
          if (this.research.autopilot === 100) {
            clearInterval(intervalId);
          }
        }, 100);
      }
    },
    components: {
      Rocket: RocketView
    }
  };
</script>
<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #2c3e50;*/
    color: #65b1fc;
    background-image: linear-gradient(to top, #5b97bc, #00002d);
    position: absolute;
    left: 0;
    right: 0;
    height: 200vh;
    transition: top 2s ease;
  }

  .top,
  .bottom {
    position: relative;
    height: 50%;
    width: 100%;
  }

  .toolbar {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 60px 30px 0 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    button {
      font-size: 28px;
      margin: 0 10px;
    }
  }

  .money {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 72px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    bottom: 50%;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
  }

  .rockets {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
  }

  .navigate-down {
    z-index: 1;
    position: absolute;
    bottom: 10px;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
  }

  .navigate-up {
    z-index: 1;
    position: absolute;
    top: 10px;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
  }

  .research {
    height: 40px;
    width: 500px;
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > button, > span {
      display: inline-block;
      font-size: 28px;
      font-weight: bold;
      width: 100%;
      height: 100%;
    }

    > button {
      text-align: center;
    }

    > span {
      display: inline-block;
      font-size: 28px;
      font-weight: bold;
      text-align: left;
    }

    .research-bar {
      display: block;
      background: rgba(135, 206, 235, .2);
      letter-spacing: -.19em;
      height: 100%;
    }
  }
</style>
