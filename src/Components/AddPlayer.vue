<template>
  <div class="mt-5">
    <h3 class="text-center text-warning"><i class="bi bi-person"></i>
      {{ t('addPlayer', 2) }}
    </h3>
    <div class="card text-light p-4 rounded bg-dark">
      <b-form @submit.prevent="addNewPlayers">
        <div class="form-floating mb-3">
          <b-form-textarea
              id="playerNames"
              placeholder=""
              ref="playerNamesInput"
              v-model="playerNames"
              :class="{'is-invalid': playerNamesError}"
              class="h-100"
              rows="6"
              @input="validatePlayerNames"
          ></b-form-textarea>
          <label for="playerNames" class="text-dark">{{ t('enterPlayerNames') }} *</label>
          <div v-if="playerNamesError" class="invalid-feedback">
            {{ playerNamesError }}
          </div>
        </div>

        <b-button type="submit" variant="warning" class="w-100 fs-5 fw-medium">
          <i class="bi bi-floppy"></i> {{ t('save') }}
        </b-button>
      </b-form>
    </div>
  </div>
</template>


<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {usePlayersStore} from '../stores/usePlayersStore';
import {BForm, BButton} from 'bootstrap-vue-3';

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const playerNames = ref('');
const playerNamesError = ref('');

const addNewPlayers = () => {
  if (!validatePlayerNames()) return;

  const playerList = playerNames.value
      .split("\n")
      .map(name => name.trim())
      .filter(name => name.length > 0);

  playerList.forEach(name => {
    if (name.length <= 30 && !playersStore.players.some(player => player.name === name)) {
      playersStore.addPlayer(name, null, false);
    }
  });

  playerNames.value = '';
};
const validatePlayerNames = () => {
  const names = playerNames.value.split("\n").map(name => name.trim()).filter(name => name.length > 0);

  if (names.length === 0) {
    playerNamesError.value = t('playerNameRequired');
    return false;
  }

  if (names.some(name => name.length > 30)) {
    playerNamesError.value = t('playerNameTooLong');
    return false;
  }

  playerNamesError.value = "";
  return true;
};
</script>
