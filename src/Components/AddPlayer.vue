<template>
  <div class="mt-4">
    <form @submit.prevent="addNewPlayers" class="flex items-start gap-4">
      <div class="flex-grow">
        <input
            id="playerNames"
            ref="playerNamesInput"
            v-model="playerNames"
            @input="validatePlayerNames"
            :class="{'border-red-500': playerNamesError}"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            :placeholder="t('enterPlayerNames')"
        />
        <p v-if="playerNamesError" class="text-red-500 text-sm mt-1">
          {{ playerNamesError }}
        </p>
      </div>
      <button type="submit"
              class="px-4 py-2 bg-yellow-400 text-black rounded-md text-lg font-medium flex items-center self-start h-full">
        <i class="bi bi-floppy mr-2"></i> {{ t('save') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {usePlayersStore} from '../stores/usePlayersStore';

const {t} = useI18n({useScope: 'global'});
const playersStore = usePlayersStore();
const playerNames = ref('');
const playerNamesError = ref('');

const addNewPlayers = () => {
  if (!validatePlayerNames()) return;

  const playerList = playerNames.value
      .split(",")
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
  const names = playerNames.value.split(",").map(name => name.trim()).filter(name => name.length > 0);

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
