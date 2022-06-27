<template>
  <div id='comp'>
    {{ decoded }}
  </div>
</template>

<script>
import decoder from '../decoder'

export default {
  data () {
    return {
      decoded: decoder.decode("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZXAtbVwvdG9rZW4taXNzdWVyIiwiZXhwIjoxNTE2MTEzNzYxLCJpYXQiOjE1MTYwMjczNjEsImp0aSI6IjVhNWNiZGUxZWM3YzYiLCJnaWQiOjN9.E-YN6q8gOrpAC9NHgn3hX1Alon8tQmj0q_0YTWRDLM8")
    }
  }
}
</script>

