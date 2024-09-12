import { Console } from "console";
import fs, { appendFileSync } from "fs"
import { Transform } from "stream";
import path from "path";
import CsvWriter from "csv-writer"
import { Parser } from "@json2csv/plainjs";
import { stringify } from "csv-stringify"

function WriteToJson(json) {
    fs.writeFileSync("./data.json", JSON.stringify({ "data": json }))
    return;
}

function ReadFromJson() {
    if (!fs.existsSync("./data.json")) {
        WriteToJson([])
        return []
    }
    return (JSON.parse(fs.readFileSync("./data.json"))).data
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}


function AddToExpenseList(options) {
    if (typeof (options.description) === "string" && Number.isInteger(parseInt(options.amount)) || isFloat(parseFloat(n))) {
        const result = ReadFromJson()
        const data = {
            id: result.length + 1,
            date: new Date().toJSON().split("T")[0],
            description: options.description,
            amount: options.amount,
            category: options.category
        }


        const newList = { "data": [...result, data] }
        fs.writeFileSync("./data.json", JSON.stringify(newList))
        console.log(`Expense added successfully (ID: ${data.id})`)
    } else {
        console.log("Enter the right data")
        process.exit(1)
    }

}

function MakeNumberToMonth(num) {
    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    return months[num] || "Invalid month";
}


function GetSummery(month) {
    if (typeof (parseInt(month)) == "number") {
        if (parseFloat(month) !== parseInt(month)) {
            console.error("please enter integers, not floating point numbers")
            return
        }
        if (parseInt(month) <= 12 && parseInt(month) > 0) {
            const result = (JSON.parse(fs.readFileSync("./data.json"))).data
            const year = new Date().getFullYear()
            const newList = result.filter((item) => {
                if (parseInt(item.date.split("-")[0]) === year && parseInt(item.date.split("-")[1]) === parseInt(month)) {
                    return true
                }
                return false
            })
            if (newList.length === 0) {
                console.log(`Zero expense for ${MakeNumberToMonth(month)}`)
                return;
            }
            let total = 0;
            newList.forEach((e) => total += parseInt(e.amount))
            console.log(`Total expenses for ${MakeNumberToMonth(month)}: $${total}`)
            return
        } else {
            console.log("Enter right month")
            return
        }

    }

    if (!month) {
        let total = 0;
        const result = JSON.parse(fs.readFileSync("./data.json"))
        result.data.forEach((e) => total += parseInt(e.amount))
        console.log(`Total expenses: $${total}`)
    } else {
        console.error(`Enter the number not ${typeof (month)}`)
    }
}


function table(input) {
    // @see https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    }
    console.log(result);
}

function GetAllData(category) {
    const result = ReadFromJson()

    if (category) {
        const data = result.filter((item) => item.category === category)
        if (data.length === 0) {
            console.log(`Not found your expenses with ${category}`)
            return
        }
        table(data)
        return
    }

    if (result.length === 0) {
        console.log("Not have any expense")
        return;
    }
    table(result)
}

function DeleteExpense(id) {
    const result = ReadFromJson()
    if (parseInt(id) === NaN) {
        console.log(`Enter the integer not ${typeof (id)}`)
        process.exit(1)
    }
    if (result.length === 0) {
        console.log("No Expenses")
        process.exit(1)
    }

    if (!result.find((item) => parseInt(item.id) === parseInt(id))) {
        console.log("Not Found your Expenses")
        process.exit(1)
    }

    const newList = result.filter((item) => parseInt(item.id) !== parseInt(id))
    WriteToJson(newList)
    console.log("Expense deleted successfully")
}

function UpdateExpense({ description, amount, category, id }) {
    const result = ReadFromJson()
    if (parseInt(id) === NaN) {
        console.log(`Enter the integer not ${typeof (id)}`)
        process.exit(1)
    }
    if (result.length === 0) {
        console.log("No Expenses")
        process.exit(1)
    }
    if (amount) {
        const n = parseFloat(amount)
        if (!(isFloat(parseFloat(n)) || Number.isInteger(parseInt(n)))) {
            console.log("Hello")
            console.log(`Enter the number`)
            process.exit(1)
        }
    }
    const expense = result.find((item) => parseInt(item.id) === parseInt(id))
    if (!expense) {
        console.log("Not Found your Expenses")
        process.exit(1)
    }

    const updatedExpense = {
        description: description ? description : expense.description,
        amount: amount ? amount : expense.amount,
        id: id,
        category: category ? category : expense.category
    }
    const newList = result.map((item) => {
        if (parseInt(item.id) === parseInt(id)) {
            return updatedExpense
        }
        return item
    })
    WriteToJson(newList)
    console.log("Expense updated successfully")
}

function BudgetForMonth() {

}


const Expenses = ({ id, description, amount, category }) => {
    const cvs = `${id},${description},${amount},${category}\n`
    try {
        appendFileSync("./data.csv", cvs)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

function ExportDataToCVS() {
    const result = ReadFromJson()
    if (result.length === 0) {
        console.log("No Elements")
        process.exit(1)
    }
    const columns = {
        id: 'ID',
        description: "Description",
        amount: "Amount",
        category: "Category"
    }
    stringify(result, { header: true, columns: columns }, (err, output) => {
        if (err) throw err;
        fs.writeFileSync("./data.csv", output)
    })
}


export {
    GetSummery,
    AddToExpenseList,
    GetAllData,
    DeleteExpense,
    UpdateExpense,
    ExportDataToCVS
}