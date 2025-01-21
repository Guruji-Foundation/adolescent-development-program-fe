import React from 'react';
import AgGridTable from './AgGridTable';
import './CustomTable.css';

const CustomTable = ({ 
  rowData, 
  columnDefs, 
  defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressSizeToFit: true,
    flex: 1,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  paginationPageSize = 10,
  rowHeight = 48,
  headerHeight = 48,
  ...props
}) => {
  return (
    <div className="ag-theme-quartz custom-table-container">
      <AgGridTable 
        rowData={rowData} 
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={paginationPageSize}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        animateRows={true}
        enableCellTextSelection={true}
        suppressMovableColumns={true}
        suppressDragLeaveHidesColumns={true}
        onGridSizeChanged={(params) => {
          params.api.sizeColumnsToFit();
        }}
        onFirstDataRendered={(params) => {
          params.api.sizeColumnsToFit();
        }}
        className="custom-ag-table"
        {...props}
      />
    </div>
  );
};

export default CustomTable; 