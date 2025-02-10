<template>
  <div class="card p-3">
    <b-form @submit.prevent="addNewPlayer">
      <b-input-group class="mb-2">
        <b-form-input v-model="playerName" placeholder="Enter player name" required></b-form-input>
      </b-input-group>
      <b-input-group>
        <b-form-input v-model.number="playerElo" type="number" placeholder="Enter ELO (optional)"></b-form-input>
        <b-button type="submit" variant="success">Add</b-button>
      </b-input-group>
    </b-form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {usePlayersStore} from '../stores/usePlayersStore';
import {BForm, BFormInput, BInputGroup, BButton} from 'bootstrap-vue-3';

const playersStore = usePlayersStore();
const playerName = ref('');
const playerElo = ref('');

const addNewPlayer = () => {
  if (playerName.value.trim() !== '') {
    playersStore.addPlayer(playerName.value.trim(), playerElo.value | 1200);
    playerName.value = '';
    playerElo.value = null;
  }
};
</script>
