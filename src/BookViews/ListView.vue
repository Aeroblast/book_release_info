<template>
  <div class="list_view">
    <ul>
      <li v-for="book in books" :key="book.key" :data-key="book.key">
        <div class="cover_container">
          <img
            :src="
              book.records[0].coverFile
                ? data_root + book.records[0].coverFile
                : 'cover_dummy.jpg'
            "
            :title="
              book.records[0].coverFile
                ? `${book.records[0].coverSize.w}x${book.records[0].coverSize.h}`
                : ''
            "
          />
        </div>
        <div class="book_info">
          <p class="book_title">{{ book.records[0].title }}</p>
          <display-creators :record="book.records[0]" />
          <p class="info_values">
            <span>発売日：{{ book.records[0].date }} &#x3000;</span>
            <span>レーベル：{{ book.records[0].label }}</span>
          </p>
          <display-record-source :record="book.records[0]" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import DisplayRecordSource from "./shared/RecordSource.vue";
import DisplayCreators from "./shared/Creators.vue";

export default {
  name: "ListView",
  props: {
    books: Array,
    data_root: String,
  },
  components: {
    DisplayRecordSource,
    DisplayCreators,
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
ul {
  border-bottom: 1px solid #ff9641;
  list-style: none;
  margin: 1em;
  padding: 0;
  max-width: calc(100% - 2em);
}
li {
  border-top: 1px solid #ff9641;
  min-height: 12em;
  display: flex;
}
li > div {
  height: 100%;
  vertical-align: top;
}
.cover_container {
  min-height: 12em;
  height: 100%;
  width: 10em;
  text-align: center;
  position: relative;
  flex-shrink: 1;
}
.cover_container > img {
  max-width: 80%;
  width: auto;
  height: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  margin: auto;
}
.book_info {
  flex-shrink: 2;
}
.info_values > span {
  display: inline-block;
}

.book_title {
  font-size: 1.2em;
  font-weight: bold;
  white-space: normal;
  max-width: 35em;
  line-height: 1.1;
  margin-top: 1em;
}

.creators {
  display: block;
  margin-top: 0.5em;
}
.record_source {
  display: block;
  margin-top: 0.7em;
  margin-bottom: 1em;
}
</style>
