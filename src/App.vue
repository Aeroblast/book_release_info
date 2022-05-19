<template>
  <header class="main_width"><h1>新刊情報強者になろう</h1></header>
  <div id="filter_settings" class="main_width">
    <div>
      <select v-model="input_current_label">
        <option disabled value="">---</option>
        <option v-for="label in labels" :key="label">{{ label }}</option>
      </select>
      <button v-on:click="AddFilter('+')">+</button>
      <button v-on:click="AddFilter('-')">-</button>
      <span>Selected: {{ input_current_label }}</span>
    </div>

    <div>
      Filter：<span
        class="filter_item"
        v-for="filter in filters"
        :key="filter.value"
        >{{ filter.operation }}{{ filter.value
        }}<span class="remove_filter" v-on:click="RemoveFilter(filter)"
          >×</span
        ></span
      >
    </div>

    <div>
      <select v-model="sort_method" @change="SortBooks()">
        <option>Record Date</option>
        <option>Release Date</option>
      </select>
    </div>
  </div>
  <div id="content" class="main_width">
    <div style="cursor: pointer; text-align: center" v-on:click="LoadLast()">
      LAST MONTH
    </div>
    <list-view :books="books_display" :data_root="data_root" />
    <div style="cursor: pointer; text-align: center" v-on:click="LoadNext()">
      NEXT MONTH
    </div>
  </div>
  <footer>本サイトは新刊のデータに関する権利を持っていません。</footer>
</template>

<script>
import ListView from "./BookViews/ListView.vue";
import DataSource from "./dataSource";

export default {
  name: "App",
  data() {
    return {
      books: [],
      filters: [],
      lastMonth: null,
      viewingMonth: null,
      data_root: DataSource.data_root,
      dateLine: "",
      input_current_label: "",
      sort_method: "Release Date",
      displayEarlyInfo: false,
    };
  },
  components: {
    ListView,
  },
  async mounted() {
    let t = new Date();
    t.setDate(t.getDate() - 7);
    this.dateLine = t.toISOLikeDate();
    console.log("基準:" + this.dateLine);
    this.viewingMonth = t;
    this.lastMonth = new Date(t);
    this.books = await DataSource.GetData(this.viewingFile());
    this.LoadNext();
  },
  methods: {
    async LoadNext() {
      try {
        this.viewingMonth.setMonth(this.viewingMonth.getMonth() + 1);
        let x = await DataSource.GetData(this.viewingFile());
        if (x && x.length > 0) {
          for (const xx of x) {
            const exist = this.books.find((e) => e.key == xx.key);
            if (exist) {
              exist.records.push(...xx.records);
              exist.records.sort(DataSource.CompareRecords);
            } else {
              this.books.push(xx);
            }
          }
          this.SortBooks();
          this.LoadNext();
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async LoadLast() {
      this.displayEarlyInfo = true;
      try {
        this.lastMonth.setMonth(this.lastMonth.getMonth() - 1);
        let x = await DataSource.GetData(this.lastFile());
        if (x && x.length > 0) {
          for (const xx of x) {
            const exist = this.books.find((e) => e.key == xx.key);
            if (exist) {
              exist.records.push(...xx.records);
              exist.records.sort(DataSource.CompareRecords);
            } else {
              this.books.push(xx);
            }
          }
          this.SortBooks();
          this.LoadNext();
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    viewingFile() {
      return this.viewingMonth.toISOLikeDate().substring(0, 7);
    },
    lastFile() {
      return this.lastMonth.toISOLikeDate().substring(0, 7);
    },
    AddFilter(operation) {
      if (!this.input_current_label) return;
      let find = this.filters.filter(
        (e) => e.value == this.input_current_label
      );
      if (find.length > 0) {
        find[0].operation = operation;
      } else {
        this.filters.push({
          operation: operation,
          value: this.input_current_label,
        });
      }
    },
    RemoveFilter(obj) {
      this.filters = this.filters.filter((e) => e != obj);
    },
    SortBooks() {
      const method = sort_methods[this.sort_method];
      this.books.sort(method);
    },
  },
  computed: {
    labels() {
      return [...new Set(Array.from(this.books, (b) => b.records[0].label))];
    },
    books_display() {
      let temp = this.books;
      if (!this.displayEarlyInfo)
        temp = temp.filter(
          (b) => b.records[0].date.localeCompare(this.dateLine) >= 0
        );
      if (this.filters.length == 0) return temp;
      const mode = this.filters[0].operation == "+" ? false : true;
      return temp.filter((b) => {
        for (const filter of this.filters) {
          if (b.records[0].label == filter.value) {
            if (filter.operation == "+") {
              return true;
            }
            if (filter.operation == "-") {
              return false;
            }
          }
        }
        return mode;
      });
    },
  },
  watch: {
    books_display(newValue) {
      console.log("filter changed:");
      console.log(newValue);
    },
  },
};

const sort_methods = {
  "Release Date": (a, b) => a.records[0].date.localeCompare(b.records[0].date),
  "Record Date": (a, b) =>
    -a.records[0].recordTime.localeCompare(b.records[0].recordTime),
};
</script>

<style>
body {
  background: white;
  padding: 0;
  margin: 0;
}
header > h1 {
  text-align: center;
}
footer {
  text-align: center;
}

.main_width {
  width: 100vh;
  min-width: 400px;
  max-width: 100%;
  margin: auto;
}

#filter_settings {
  position: sticky;
  top: 0;
  background: rgb(231, 231, 231);
  z-index: 50;
  border: 1px solid rgb(255, 178, 71);
  border-top: none;
  border-radius: 0 0 0.5em 0.5em;
  padding: 1em;
}
.filter_item {
  border: 1px solid #cd952d;
  border-radius: 0.3em;
}
.remove_filter {
  cursor: pointer;
}
</style>
