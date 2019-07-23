import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  English: {
    desc: "Draw, guess and win!",
    nickname: "Nickname:",
    play: "Play!",
    leave_room: "Leave Room",
    enter_guess: "Enter guess...",
    play_public: "Public Room",
    play_private: "Private Room",
    public_desc: "Play with anybody online",
    private_desc: "Play with friends in a private room",
    join_room: "Join Room",
    create_room: "Create Room",
    chat_evt: {
      guessed_word: " has guessed the word!",
      going_to_draw: " is going to draw!",
      reported: "The painter has been reported.",
      player_left: " has left.",
      player_joined: " has joined."
    }
  },
  Español: {
    desc: "Dibuja, adivina y gana!",
    nickname: "Nombre:",
    play: "Jugar!",
    leave_room: "Salir de la sala",
    enter_guess: "Introduce palabra...",
    play_public: "Sala pública",
    play_private: "Sala privada",
    public_desc: "Juega con cualquiera",
    private_desc: "Juega con tus amigos en una sala privada",
    join_room: "Unirse a sala",
    create_room: "Crear sala",
    chat_evt: {
      guessed_word: " ha acertado la palabra!",
      going_to_draw: " va a dibujar.",
      reported: "El dibujante ha sido reportado.",
      player_left: " ha salido.",
      player_joined: " ha entrado."
    }
  }
};

const i18n = new VueI18n({
  locale: "Español", // set locale
  fallbackLocale: "English", // set fallback locale
  messages // set locale messages
});

export default i18n;
