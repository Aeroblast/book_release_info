<template>
  <span class="record_source">
    <span>初記録：{{ record.recordTime }}&#x3000;</span>
    <span>Last Check：{{ record.lastCheckTime }}&#x3000;</span>
    <span
      >情報源：
      <a
        v-if="record.source.startsWith('http')"
        :href="record.source"
        :title="record.source"
        target="_blank"
        >🔗{{ link2Name(record.source) }}</a
      ><span v-else>{{ record.source }}</span></span
    >
  </span>
</template>

<script>
export default {
  name: "DisplayRecordSource",
  props: {
    record: Object,
  },
  methods: {
    link2Name(source) {
      switch (source) {
        case "https://www.ktcom.jp/new_release.htm":
          return "公式サイト（KTC，発売予定ページ）";
        case "https://bookclub.kodansha.co.jp/calendar":
          return "公式サイト（講談社，書籍発売予定ページ）";
        case "https://kc.kodansha.co.jp/calendar":
          return "公式サイト（講談社，マンガ発売予定ページ）";
        case "https://dengekibunko.jp/product/newrelease-bunko.html":
          return "公式サイト（電撃文庫，発売予定ページ）";
        case "https://gagagabunko.jp/release/index.html":
          return "公式サイト（ガガガ文庫，発売予定ページ）";
        case "https://fantasiabunko.jp/":
          return "公式サイト（ファンタジア文庫）";
      }
      let x = source.split("/");
      if (x.length < 3) return "Link";
      let host = x[2];
      switch (host) {
        case "www.kadokawa.co.jp":
          return "公式サイト (KADOKAWA)";
        case "hon-hikidashi.jp":
          return "ほんのひきだし";
        case "www.amazon.co.jp":
          return "Amazon JP";
      }
      console.log("Unknown source: " + source);
      return "Link";
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.record_source {
  font-size: 0.5em;
  color: #a0a0a0;
}
.record_source > span {
  display: inline-block;
}
</style>
