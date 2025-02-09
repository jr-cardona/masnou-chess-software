<template>
  <div class="card p-3">
    <b-form @submit.prevent="addNewPlayer">
      <b-input-group>
        <b-form-input v-model="playerName" placeholder="Enter player name" required></b-form-input>
        <b-button type="submit" variant="success">➕ Add</b-button>
      </b-input-group>
    </b-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTournamentStore } from '../stores/useTournamentStore';
import { BForm, BFormInput, BInputGroup, BButton } from 'bootstrap-vue-3';

const store = useTournamentStore();
const playerName = ref('');

const addNewPlayer = () => {
  if (playerName.value.trim() !== '') {
    store.addPlayer(playerName.value.trim());
    playerName.value = '';
  }
};
</script>
