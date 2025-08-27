import { defineStore } from 'pinia'

import { useSocketStore } from './socket'

import type { BattleCharacter, Character } from "@/types";

interface InitiativeState {
    characters: BattleCharacter[];
    initiativeOrder: string[];
}

export const useInitiativeStore = defineStore('initiative', {
    state: (): InitiativeState => ({
        characters: [],
        initiativeOrder: []
    }),

    actions: {
        // addCharacter(character: Character) {
        //     const battleCharacter: BattleCharacter = {
        //         ...character,
        //         initiative: 0,
        //         isVisible: true,
        //         conditions: []
        //     }
        //
        //     this.characters.push(battleCharacter)
        //     this.updateServer()
        // },

        addCharacter(character: BattleCharacter) {
            this.characters.push(character)

            // Если у персонажа есть инициатива, обновляем порядок
            if (character.initiative > 0) {
                this.updateInitiativeOrder()
            }
        },

        updateInitiativeOrder() {
            this.initiativeOrder = this.characters
              .filter(c => c.initiative > 0)
              .sort((a, b) => b.initiative - a.initiative)
              .map(c => c.id!)
        },

        updateCharacterInitiative(characterId: string, newInitiative: number) {
            const character = this.characters.find(c => c.id === characterId)

            if (character) {
                character.initiative = newInitiative
                this.updateServer()
            }
        },

        updateServer() {
            const socketStore = useSocketStore()

            this.characters.forEach(char => {
                socketStore.updateInitiative(char.id, char.initiative)
            })
        },

        updateFromServer(sessionData: any) {
            // Обновляем состояние на основе данных с сервера
            if (sessionData.charactersInBattle) {
                this.characters = sessionData.charactersInBattle
            }
            if (sessionData.initiativeOrder) {
                this.initiativeOrder = sessionData.initiativeOrder
            }
        }
    }
})
