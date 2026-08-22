document.getElementById("addRow").addEventListener("click", function() {  
    const nameInput = document.getElementById("nameInput").value.trim();  
    const ageInput = parseInt(document.getElementById("ageInput").value);  

    if (nameInput === "" || isNaN(ageInput)) {  
        alert("请输入有效的姓名和年龄！");  
        return;  
    }  

    // 创建新的行  
    const table = document.getElementById("myTable");  
    const newRow = table.insertRow(-1); // 在表格的最后添加新行  
    const cell1 = newRow.insertCell(0);  
    const cell2 = newRow.insertCell(1);  
    const cell3 = newRow.insertCell(2);  

    // 设置单元格内容  
    cell1.innerHTML = nameInput;  
    cell2.innerHTML = ageInput;  
    cell3.innerHTML = `<span class="delete-button" onclick="deleteRow(this)">删除</span>`;  

    // 清空输入框  
    document.getElementById("nameInput").value = "";  
    document.getElementById("ageInput").value = "";  

    // 按年龄排序  
    sortTable();  
});  

function deleteRow(button) {  
    const row = button.parentNode.parentNode; // 获取当前行  
    row.parentNode.removeChild(row); // 删除当前行  
}  

function sortTable() {  
    const table = document.getElementById("myTable");  
    const rows = Array.from(table.rows).slice(1); // 获取所有行，排除表头  

    rows.sort((a, b) => {  
        const ageA = parseInt(a.cells[1].innerText);  
        const ageB = parseInt(b.cells[1].innerText);  
        return ageA - ageB; // 按年龄升序排序  
    });  

    // 清空表格并重新添加排序后的行  
    table.innerHTML = `<tr><th>姓名</th><th>年龄</th><th>操作</th></tr>`; // 重新添加表头  
    rows.forEach(row => table.appendChild(row));  
}  