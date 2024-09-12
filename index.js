import { Command } from "commander"
import { AddToExpenseList, DeleteExpense, ExportDataToCVS, GetAllData, GetSummery, UpdateExpense } from "./utils.js"
const program = new Command()

program
    .name("expense-tracker")
    .version("1.0.0")

program
    .command("add")
    .requiredOption("--description <char>")
    .requiredOption("--amount <number>")
    .requiredOption("--category <category>")
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
    .action(({category}) => {
        GetAllData(category)
    })


program
    .command("delete")
    .requiredOption("--id <number>")
    .action(({id}) => {
        DeleteExpense(id)
    })

program
    .command("update")
    .option("--description <char>")
    .option("--amount <number>")
    .option("--category <category>")
    .requiredOption("--id <id>")
    .action((options) => {
        UpdateExpense(options)
    })


program
    .command("export-cvs")
    .action(() => {
        ExportDataToCVS()
    })


program.parse(process.argv)