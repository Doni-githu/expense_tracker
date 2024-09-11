import fs from "fs"

function WriteToJson(json) {
    fs.writeFileSync("./data.json", JSON.stringify(json))
    return;
}

function ReadFromJson() {
    if (!fs.existsSync("./data.json")) {
        WriteToJson([])
        return []
    }
    return JSON.parse(fs.readFileSync("./data.json"))
}

function AddToExpenseList(options) {
    if (typeof (options.description) === "string" && typeof (parseInt(options.amount)) === "number") {
        const result = ReadFromJson()


        const data = {
            date: new Date().toJSON().split("T")[0],
            id: result.length + 1,
            description: options.description,
            amount: options.amount
        }


        const newList = [...result, data]
        fs.writeFileSync("./data.json", JSON.stringify(newList))
        console.log(newList)
    } else {
        console.log("Enter the right data")
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
            const result = JSON.parse(fs.readFileSync("./data.json"))
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
        result.forEach((e) => total += parseInt(e.amount))
        console.log(`Total expenses: $${total}`)
    } else {
        console.error(`Enter the number not ${typeof (month)}`)
    }
}

export {
    GetSummery,
    AddToExpenseList
}