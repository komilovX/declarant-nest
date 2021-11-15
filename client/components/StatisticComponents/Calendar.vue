<template>
  <div class="p-4 bg-white h-full">
    <FullCalendar
      ref="fullCalendar"
      class="demo-app-calendar"
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import moment from 'moment'
import { eventsStore, statisticsStore } from '~/store'
export default {
  components: {
    FullCalendar,
  },
  props: {
    events: {
      type: Array,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      ctrlKey: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        initialView: 'dayGridMonth',
        locale: ruLocale,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventChange: this.handleEventChange,
        events: [],
        customButtons: {
          prev: {
            click: async () => {
              const api = this.$refs.fullCalendar.getApi()
              if (api.view.type === 'dayGridMonth') {
                const date = moment(api.view.currentStart)
                  .subtract(1, 'months')
                  .format('YYYY-MM-DD')
                const events = await eventsStore.findAll(date)
                let tasks = await statisticsStore.findTasksForCalendar(date)
                tasks = this.genereteTasks(tasks)
                this.calendarOptions.events = events.concat(tasks)
              }
              api.prev()
            },
          },
          next: {
            click: async () => {
              const api = this.$refs.fullCalendar.getApi()
              if (api.view.type === 'dayGridMonth') {
                const date = moment(api.view.currentEnd).format('YYYY-MM-DD')
                const events = await eventsStore.findAll(date)
                let tasks = await statisticsStore.findTasksForCalendar(date)
                tasks = this.genereteTasks(tasks)
                this.calendarOptions.events = events.concat(tasks)
              }
              api.next()
            },
          },
        },
      },
      currentEvents: [],
    }
  },
  watch: {
    tasks(tasks) {
      this.calendarOptions.events = this.events.concat(
        this.genereteTasks(tasks)
      )
    },
  },
  mounted() {
    const calendar = document.querySelector('.demo-app-calendar')
    calendar.addEventListener('click', this.handleClick)
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends
    },
    handleDateSelect(selectInfo) {
      this.$prompt('Пожалуйста, введите свое событие', 'Событие', {
        confirmButtonText: 'Отправить',
        cancelButtonText: 'Отменить',
      })
        .then(async ({ value }) => {
          try {
            const calendarApi = selectInfo.view.calendar
            calendarApi.unselect()
            const data = {
              title: value,
              start: selectInfo.startStr,
              end: selectInfo.endStr,
              allDay: selectInfo.allDay,
              backgroundColor: '#9333ea',
            }
            const event = await eventsStore.create(data)
            calendarApi.addEvent(event)
          } catch (error) {
            console.log(`error`, error)
          }
        })
        .catch(() => {})
    },
    handleEventClick(clickInfo) {
      setTimeout(() => {
        if (this.ctrlKey) {
          this.$confirm(
            'This will permanently delete the file. Continue?',
            'Warning',
            {
              confirmButtonText: 'Подтверждать',
              cancelButtonText: 'Отмена',
              type: 'warning',
            }
          )
            .then(async () => {
              try {
                await eventsStore.delete(clickInfo.event.id)
                this.$message({
                  type: 'success',
                  message: 'Удалить завершено',
                })
                clickInfo.event.remove()
              } catch (error) {
                console.log(`error`, error)
              }
            })
            .catch(() => {})
        }
      }, 50)
    },
    async handleEventChange(events) {
      try {
        const event = events.event
        const data = {
          title: event.title,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay,
        }
        await eventsStore.update({ data, id: event.id })
      } catch (error) {
        console.log(`error`, error)
      }
    },
    handleClick(event) {
      this.ctrlKey = event.ctrlKey
    },
    getBackgroundColor(date, status) {
      if (status === 'RETURNED') {
        return '#FFD700'
      } else if (status === 'TASK' && moment(date).isBefore(new Date())) {
        return '#FF4046'
      } else if (status === 'TASK') {
        return '#90EE90'
      } else if (status === 'DONE') {
        return '#1E90FF'
      }
    },
    genereteTasks(tasks) {
      return tasks.map((t) => ({
        id: t.id,
        title: `${t.name} - ${t.number}`,
        allDay: true,
        start: t.expire,
        backgroundColor: this.getBackgroundColor(t.expire, t.status),
        borderColor: 'rgba(255, 69, 0, 0)',
        editable: false,
      }))
    },
  },
}
</script>
