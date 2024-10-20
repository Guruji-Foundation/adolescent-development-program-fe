import React from "react";
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise';
 
const AgGridTable = (props) => {
    const { gridRef, rowData, columnDefs, defaultColDef, rowSelection, pagination, paginationPageSizeSelector, autoGroupColumnDef, onGridReady, handleCellClick,
        onSelectionChanged, onFirstDataRendered, enableAdvancedFilter, toolPanels, alwaysShowHorizontalScroll, gridOptions, ...rest } = props;
    return (
        <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            pagination={pagination}
            paginationPageSizeSelector={paginationPageSizeSelector}
            autoGroupColumnDef={autoGroupColumnDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            onSelectionChanged={onSelectionChanged}
            onCellClicked={handleCellClick}
            enableAdvancedFilter={enableAdvancedFilter}
            alwaysShowHorizontalScroll={alwaysShowHorizontalScroll}
            gridOptions={gridOptions}
            sideBar={{
                toolPanels: toolPanels,
            }}
            {...rest}
        />
    )
}
 
export default AgGridTable;
 