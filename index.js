import { Command } from "commander"
import { AddToExpenseList, GetAllData, GetSummery } from "./utils.js"
const program = new Command()

program
    .name("expense-tracker")
    .version("1.0.0")

program
    .command("add")
    .requiredOption("--description <char>")
    .requiredOption("--amount <number>")
    .action((options) => {
        AddToExpenseList(options)
    })

program
    .command("summary")
    .option("--month <number>")
    .action(({ month }) => {
        GetSummery(month)
    })


program
    .command("list")
    .option("--category <category>")
    .action((option) => {
        GetAllData()
    })

program.parse(process.argv)