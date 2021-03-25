<template>
  <div class="chat">
    <beautiful-chat
      :participants="participants"
      :title-image-url="titleImageUrl"
      :on-message-was-sent="onMessageWasSent"
      :message-list="messages"
      :new-messages-count="newMessagesCount"
      :is-open="isChatOpen"
      :open="openChat"
      :close="closeChat"
      :icons="icons"
      :show-emoji="true"
      :show-edition="true"
      :show-deletion="true"
      :show-typing-indicator="showTypingIndicator"
      :show-launcher="false"
      :disable-user-list-toggle="true"
      :show-close-button="true"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :message-styling="messageStyling"
    />
  </div>
</template>

<script>
import CloseIcon from '@/static/chat-images/close-icon.png'
import OpenIcon from '@/static/chat-images/logo-no-bg.svg'
import FileIcon from '@/static/chat-images/file.svg'
import CloseIconSvg from '@/static/chat-images/close.svg'

export default {
  name: 'App',
  props: {
    isChatOpen: {
      type: Boolean,
      default: false,
    },
    participants: {
      type: Array,
      required: true,
    },
    orderId: {
      type: Number,
      required: true,
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons: {
        open: {
          img: OpenIcon,
          name: 'default',
        },
        close: {
          img: CloseIcon,
          name: 'default',
        },
        file: {
          img: FileIcon,
          name: 'default',
        },
        closeSvg: {
          img: CloseIconSvg,
          name: 'default',
        },
      },
      titleImageUrl:
        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [],
      newMessagesCount: 0,
      showTypingIndicator: '',
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        launcher: {
          bg: '#4e8cff',
        },
        messageList: {
          bg: '#ffffff',
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222',
        },
        userInput: {
          bg: '#eaeaea',
          text: '#565867',
        },
      },
      alwaysScrollToBottom: false,
      messageStyling: true,
    }
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          data: { text },
        })
      }
    },
    async onMessageWasSent(message) {
      try {
        await this.$axios.$post('api/message', {
          order_id: this.order_id,
          message,
        })
        this.messageList = [...this.messageList, message]
      } catch (error) {
        console.log(error)
        this.$message.error('Что-то пошло не так')
      }
    },
    closeChat() {
      this.$emit('closeChat')
    },
    openChat() {},
    handleScrollToTop() {},
  },
}
</script>
<style>
.chat {
  position: absolute;
  z-index: 55555;
}
.sc-chat-window {
  height: calc(100% - 11 0px) !important;
  bottom: 60px !important;
}
</style>
