
const data_root = "/book_release_info_data/"

async function GetData(filename) {
    if (!filename.endsWith(".json")) filename = filename + ".json";
    let res = await fetch(data_root + filename + `?t=${new Date().toISOString()}`);
    if (res.status != 200) {
        console.log(`${filename}: ${res.status}`)
        return null;
    }
    let raw_records = await res.json();
    let tempDict = {};
    raw_records.forEach(record => {
        let key = Title2Key(record.title);
        if (!tempDict[key]) tempDict[key] = [];
        tempDict[key].push(record);
    });
    let result = [];
    for (const key in tempDict) {
        const recordList = tempDict[key];
        recordList.sort(CompareRecords);
        result.push({ key: key, records: recordList })
    }

    for (let i = 0; i < result.length; i++) {
        const a_isbn = TryGetValueFromList(result[i].records, "isbn");
        if (!a_isbn) continue;
        for (let j = i + 1; j < result.length; j++) {
            if (a_isbn == TryGetValueFromList(result[j].records, "isbn")) {
                const toBeMerge = result.splice(j, 1)[0];
                result[i].key = CompareRecords(result[i].records[0], toBeMerge.records[0]) < 0 ?
                    result[i].key : toBeMerge.key;
                result[i].records.push(...toBeMerge.records)
                result[i].records.sort(CompareRecords);
            }
        }
    }


    result.sort((a, b) => a.records[0].date.localeCompare(b.records[0].date));
    console.log(filename + ":")
    console.log(result)
    return result;
}

function TryGetValueFromList(recordList, name) {
    for (const record of recordList) {
        if (name in record) {
            return record[name];
        }
    }
    return undefined;
}

function Title2Key(rawTitle) {
    let r = rawTitle;
    r = r.replace(/[\uFF10-\uFF19]/g, m => String.fromCharCode(m.charCodeAt(0) - 0xfee0)); //fullwidth number
    r = r.replace(/[\u2460-\u2473]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x2460 + 49))//⓪
    r = r.replace(/[(（][^0-9]*?[）)]/g, "");//去除括号内非数字的，比如（仮）


    r = r.replace(/[(（]([0-9]*?)[）)]/g, m => m[1]); // (1) => 1
    r = r.replace(/[0-9]+/g, m => parseInt(m)); // 01 => 1

    r = r.replaceAll('\u3000', '').replaceAll(' ', '');
    r = r.trim();
    return r;
}

const sourceBuffMap = {
    "https://www.ktcom.jp/new_release.htm": 1,
    "https://bookclub.kodansha.co.jp/calendar": -1,
    "https://kc.kodansha.co.jp/calendar": -1,
    "https://dengekibunko.jp/product/newrelease-bunko.html": -1,
    "https://gagagabunko.jp/release/index.html": -1,
    "https://fantasiabunko.jp/": -1,
    "手書き": 0
}
const sourceBuffMap2 = {
    "hon-hikidashi.jp": -10,
    "www.amazon.co.jp": 1,

}
/**
 * 
 * @returns {Number} buff (days)
 */
function getSourceBuff(record) {
    const src = record.source;
    if (src in sourceBuffMap) {
        return sourceBuffMap[src];
    }
    let x = src.split("/");
    if (x.length < 3) return 0;
    const host = x[2];

    if (host in sourceBuffMap2) {
        return sourceBuffMap2[host];
    }
    return 0;
}

function CompareRecords(a, b) {
    if (a.coverFile && !b.coverFile) return -1;
    if ((!a.coverFile) && b.coverFile) return 1;
    const src_buff_a = getSourceBuff(a), src_buff_b = getSourceBuff(b);
    let time_a = new Date(a.recordTime), time_b = new Date(b.recordTime);
    time_a.setDate(time_a.getDate() + src_buff_a);
    time_b.setDate(time_b.getDate() + src_buff_b);
    let r = time_b.getTime() - time_a.getTime();
    return r
}
exports.GetData = GetData;
exports.CompareRecords = CompareRecords
exports.data_root = data_root;