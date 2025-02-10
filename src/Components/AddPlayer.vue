<template>
  <div class="card p-3">
    <b-form @submit.prevent="addNewPlayer">
      <b-row class="align-items-center">
        <b-col>
          <b-form-input v-model="playerName" placeholder="Enter player name" required></b-form-input>
        </b-col>
        <b-col>
          <b-form-input v-model.number="playerElo" type="number" placeholder="Enter ELO (optional)"></b-form-input>
        </b-col>
        <b-col class="text-center">
          <b-form-checkbox
              v-model="startInQueue"
              :disabled="tournamentStore.status === 'inCourse'"
          >
            Start in queue
          </b-form-checkbox>
        </b-col>
        <b-col>
          <b-button type="submit" variant="success">Add</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BForm, BFormInput, BRow, BCol, BButton, BFormCheckbox} from 'bootstrap-vue-3';

const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const playerName = ref('');
const playerElo = ref('');
const startInQueue = ref(false);

const addNewPlayer = () => {
  if (playerName.value.trim() !== '') {
    playersStore.addPlayer(playerName.value.trim(), playerElo.value || 1200, startInQueue.value);
    playerName.value = '';
    playerElo.value = null;
    startInQueue.value = false;
  }
};
</script>
