function searchFix(dataTablesParameters) {
    let alteredColumns = dataTablesParameters.columns
        .map(column => {
            let value = column.searchable.toString()
            column.searchable = value
            return column;
        })
    dataTablesParameters.columns = alteredColumns
    return dataTablesParameters;
}
export{
    searchFix
}