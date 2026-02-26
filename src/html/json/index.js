document.addEventListener('DOMContentLoaded', function () {
    // 全局变量
    let fieldCounter = 0;
    let arrayItemCounter = 0;
    const fieldsContainer = document.getElementById('fieldsContainer');
    const fieldsTable = document.getElementById('fieldsTable');
    const fieldsTableBody = document.getElementById('fieldsTableBody');
    const emptyState = document.getElementById('emptyState');
    const jsonPreview = document.getElementById('jsonPreview');
    const notification = document.getElementById('notification');

    // 存储字段数据的结构
    const fieldData = {
        root: [],
        nested: {}, // 存储嵌套字段，key为parentId，value为字段数组
        arrayObjectFields: {} // 存储数组中对象的字段，key为"fieldId_itemId"
    };

    // 添加字段按钮
    document.getElementById('addField').addEventListener('click', function () {
        addField('string');
    });

    // 添加对象按钮
    document.getElementById('addObject').addEventListener('click', function () {
        addField('object');
    });

    // 添加数组按钮
    document.getElementById('addArray').addEventListener('click', function () {
        addField('array');
    });

    // 重置表单按钮
    document.getElementById('resetForm').addEventListener('click', function () {
        if (confirm('确定要重置所有字段吗？此操作不可撤销。')) {
            // 清空数据
            fieldData.root = [];
            fieldData.nested = {};
            fieldData.arrayObjectFields = {};
            fieldCounter = 0;
            arrayItemCounter = 0;

            // 清空表格
            fieldsTableBody.innerHTML = '';
            emptyState.style.display = 'block';
            fieldsTable.style.display = 'none';

            // 更新预览
            updateJsonPreview();
        }
    });

    // 复制JSON按钮
    document.getElementById('copyJson').addEventListener('click', function () {
        const jsonData = generateJson();
        const jsonString = JSON.stringify(jsonData, null, 2);

        navigator.clipboard.writeText(jsonString).then(() => {
            showNotification('JSON已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动复制JSON内容');
        });
    });

    // 下载JSON文件按钮
    document.getElementById('downloadJson').addEventListener('click', function () {
        const jsonData = generateJson();
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('JSON文件已下载！');
    });

    /**
     * 添加字段
     * @param {string} type 字段类型
     * @param {number} parentId 父字段ID（嵌套字段使用）
     * @param {number} nestedLevel 嵌套层级
     * @param {string} arrayObjectKey 数组对象的key（"fieldId_itemId"）
     */
    function addField(type = 'string', parentId = null, nestedLevel = 0, arrayObjectKey = null) {
        // 生成新字段ID
        fieldCounter++;
        const fieldId = fieldCounter;

        // 构建字段数据
        const newField = {
            id: fieldId,
            name: `field${fieldId}`,
            type: type,
            value: type === 'string' ? '' : (type === 'number' ? 0 : (type === 'boolean' ? true : null)),
            parentId: parentId,
            nestedLevel: nestedLevel,
            arrayItems: [], // 数组类型字段的子项
            arrayObjectKey: arrayObjectKey // 关联的数组对象key
        };

        // 存储字段数据
        if (arrayObjectKey) {
            // 数组对象的字段
            if (!fieldData.arrayObjectFields[arrayObjectKey]) {
                fieldData.arrayObjectFields[arrayObjectKey] = [];
            }
            fieldData.arrayObjectFields[arrayObjectKey].push(newField);
        } else if (parentId) {
            // 普通嵌套字段
            if (!fieldData.nested[parentId]) {
                fieldData.nested[parentId] = [];
            }
            fieldData.nested[parentId].push(newField);
        } else {
            // 根字段
            fieldData.root.push(newField);
        }

        // 更新UI
        renderFieldsTable();
        updateJsonPreview();

        // 显示表格，隐藏空状态
        emptyState.style.display = 'none';
        fieldsTable.style.display = 'table';

        return fieldId;
    }

    /**
     * 为数组字段添加子项
     * @param {number} fieldId 数组字段ID
     * @param {string} itemType 数组项类型
     */
    function addArrayItem(fieldId, itemType = 'string') {
        arrayItemCounter++;
        const itemId = arrayItemCounter;

        // 找到对应的数组字段
        let targetField = null;

        // 先查找根字段
        targetField = fieldData.root.find(field => field.id === fieldId);

        // 如果没找到，查找嵌套字段
        if (!targetField) {
            for (const parentId in fieldData.nested) {
                const nestedField = fieldData.nested[parentId].find(field => field.id === fieldId);
                if (nestedField) {
                    targetField = nestedField;
                    break;
                }
            }
        }

        // 如果找到数组字段，添加子项
        if (targetField && targetField.type === 'array') {
            const newItem = {
                id: itemId,
                type: itemType,
                value: itemType === 'string' ? '' : (itemType === 'number' ? 0 : (itemType === 'boolean' ? true : null)),
                // 对于对象类型，默认值设为空对象而不是null
                objectValue: itemType === 'object' ? {} : null,
                nestedFields: [], // 如果是对象类型，存储嵌套字段ID
                nestedArrayItems: [] // 如果是数组类型，存储嵌套数组项
            };

            targetField.arrayItems.push(newItem);

            // 如果是对象类型，初始化空对象的字段容器
            if (itemType === 'object') {
                const key = `${fieldId}_${itemId}`;
                fieldData.arrayObjectFields[key] = [];
            }

            // 更新UI
            renderFieldsTable();
            updateJsonPreview();

            return itemId;
        }

        return null;
    }

    /**
     * 为数组中的对象添加字段
     * @param {number} fieldId 数组字段ID
     * @param {number} itemId 数组项ID
     * @param {string} fieldType 字段类型
     */
    function addFieldToArrayObject(fieldId, itemId, fieldType = 'string') {
        const key = `${fieldId}_${itemId}`;
        const nestedLevel = 2; // 数组对象字段的嵌套层级

        // 添加字段并关联到数组对象
        return addField(fieldType, null, nestedLevel, key);
    }

    /**
     * 删除字段
     * @param {number} fieldId 要删除的字段ID
     * @param {string} arrayObjectKey 关联的数组对象key（可选）
     */
    function deleteField(fieldId, arrayObjectKey = null) {
        let deleted = false;

        // 如果是数组对象的字段
        if (arrayObjectKey && fieldData.arrayObjectFields[arrayObjectKey]) {
            const index = fieldData.arrayObjectFields[arrayObjectKey].findIndex(field => field.id === fieldId);
            if (index !== -1) {
                fieldData.arrayObjectFields[arrayObjectKey].splice(index, 1);
                deleted = true;
                // 如果该数组对象下没有字段了，删除空数组
                if (fieldData.arrayObjectFields[arrayObjectKey].length === 0) {
                    delete fieldData.arrayObjectFields[arrayObjectKey];
                }
            }
        }

        // 从根字段中删除
        if (!deleted) {
            const rootIndex = fieldData.root.findIndex(field => field.id === fieldId);
            if (rootIndex !== -1) {
                fieldData.root.splice(rootIndex, 1);
                deleted = true;
            }
        }

        // 从嵌套字段中删除
        if (!deleted) {
            for (const parentId in fieldData.nested) {
                const nestedIndex = fieldData.nested[parentId].findIndex(field => field.id === fieldId);
                if (nestedIndex !== -1) {
                    fieldData.nested[parentId].splice(nestedIndex, 1);
                    deleted = true;
                    // 如果该父字段下没有子字段了，删除空数组
                    if (fieldData.nested[parentId].length === 0) {
                        delete fieldData.nested[parentId];
                    }
                    break;
                }
            }
        }

        // 递归删除所有子字段
        deleteNestedFields(fieldId);

        // 更新UI
        renderFieldsTable();

        // 如果没有字段了，显示空状态
        if (fieldData.root.length === 0 &&
            Object.keys(fieldData.nested).length === 0 &&
            Object.keys(fieldData.arrayObjectFields).length === 0) {
            emptyState.style.display = 'block';
            fieldsTable.style.display = 'none';
        }

        updateJsonPreview();
    }

    /**
     * 递归删除嵌套字段
     * @param {number} parentId 父字段ID
     */
    function deleteNestedFields(parentId) {
        if (fieldData.nested[parentId]) {
            // 先删除子字段的子字段
            fieldData.nested[parentId].forEach(childField => {
                deleteNestedFields(childField.id);
            });
            // 删除当前层级的嵌套字段
            delete fieldData.nested[parentId];
        }

        // 同时删除关联的数组对象字段
        for (const key in fieldData.arrayObjectFields) {
            if (key.startsWith(`${parentId}_`)) {
                delete fieldData.arrayObjectFields[key];
            }
        }
    }

    /**
     * 删除数组项
     * @param {number} fieldId 数组字段ID
     * @param {number} itemId 要删除的数组项ID
     */
    function deleteArrayItem(fieldId, itemId) {
        // 找到对应的数组字段
        let targetField = null;

        // 先查找根字段
        targetField = fieldData.root.find(field => field.id === fieldId);

        // 如果没找到，查找嵌套字段
        if (!targetField) {
            for (const parentId in fieldData.nested) {
                const nestedField = fieldData.nested[parentId].find(field => field.id === fieldId);
                if (nestedField) {
                    targetField = nestedField;
                    break;
                }
            }
        }

        // 如果找到数组字段，删除对应的子项
        if (targetField && targetField.type === 'array') {
            const itemIndex = targetField.arrayItems.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                // 如果是对象类型，删除关联的字段
                const item = targetField.arrayItems[itemIndex];
                if (item.type === 'object') {
                    const key = `${fieldId}_${itemId}`;
                    delete fieldData.arrayObjectFields[key];
                }

                targetField.arrayItems.splice(itemIndex, 1);

                // 更新UI
                renderFieldsTable();
                updateJsonPreview();
            }
        }
    }

    /**
     * 更新字段属性
     * @param {number} fieldId 字段ID
     * @param {string} prop 要更新的属性名
     * @param {any} value 新值
     * @param {string} arrayObjectKey 关联的数组对象key（可选）
     */
    function updateField(fieldId, prop, value, arrayObjectKey = null) {
        // 查找字段
        let targetField = null;

        // 先查找数组对象的字段
        if (arrayObjectKey && fieldData.arrayObjectFields[arrayObjectKey]) {
            targetField = fieldData.arrayObjectFields[arrayObjectKey].find(field => field.id === fieldId);
        }

        // 查找根字段
        if (!targetField) {
            targetField = fieldData.root.find(field => field.id === fieldId);
        }

        // 查找嵌套字段
        if (!targetField) {
            for (const parentId in fieldData.nested) {
                const nestedField = fieldData.nested[parentId].find(field => field.id === fieldId);
                if (nestedField) {
                    targetField = nestedField;
                    break;
                }
            }
        }

        // 更新字段属性
        if (targetField) {
            // 如果更新的是类型，重置值
            if (prop === 'type') {
                targetField.type = value;
                // 重置值为对应类型的默认值
                switch (value) {
                    case 'string':
                        targetField.value = '';
                        break;
                    case 'number':
                        targetField.value = 0;
                        break;
                    case 'boolean':
                        targetField.value = true;
                        break;
                    case 'null':
                        targetField.value = null;
                        break;
                    case 'object':
                    case 'array':
                        targetField.value = null;
                        // 如果是数组，初始化数组项
                        if (value === 'array') {
                            targetField.arrayItems = [];
                        }
                        break;
                }
            } else {
                targetField[prop] = value;
            }

            // 更新UI和预览
            renderFieldsTable();
            updateJsonPreview();
        }
    }

    /**
     * 更新数组项属性
     * @param {number} fieldId 数组字段ID
     * @param {number} itemId 数组项ID
     * @param {string} prop 要更新的属性名
     * @param {any} value 新值
     */
    function updateArrayItem(fieldId, itemId, prop, value) {
        // 找到对应的数组字段
        let targetField = null;

        // 先查找根字段
        targetField = fieldData.root.find(field => field.id === fieldId);

        // 如果没找到，查找嵌套字段
        if (!targetField) {
            for (const parentId in fieldData.nested) {
                const nestedField = fieldData.nested[parentId].find(field => field.id === fieldId);
                if (nestedField) {
                    targetField = nestedField;
                    break;
                }
            }
        }

        // 更新数组项属性
        if (targetField && targetField.type === 'array') {
            const targetItem = targetField.arrayItems.find(item => item.id === itemId);
            if (targetItem) {
                // 如果更新的是类型，重置值
                if (prop === 'type') {
                    targetItem.type = value;
                    // 重置值为对应类型的默认值
                    switch (value) {
                        case 'string':
                            targetItem.value = '';
                            break;
                        case 'number':
                            targetItem.value = 0;
                            break;
                        case 'boolean':
                            targetItem.value = true;
                            break;
                        case 'null':
                            targetItem.value = null;
                            break;
                        case 'object':
                            // 对象类型默认值设为空对象
                            targetItem.value = {};
                            targetItem.objectValue = {};
                            // 初始化数组对象字段容器
                            const key = `${fieldId}_${itemId}`;
                            if (!fieldData.arrayObjectFields[key]) {
                                fieldData.arrayObjectFields[key] = [];
                            }
                            break;
                        case 'array':
                            targetItem.value = [];
                            break;
                    }
                } else {
                    targetItem[prop] = value;
                }

                // 更新UI和预览
                renderFieldsTable();
                updateJsonPreview();
            }
        }
    }

    /**
     * 渲染字段表格
     */
    function renderFieldsTable() {
        // 清空表格内容
        fieldsTableBody.innerHTML = '';

        // 渲染根字段
        fieldData.root.forEach(field => {
            renderFieldRow(field);
        });

        // 渲染嵌套字段（递归）
        function renderNestedFields(parentId, parentNestedLevel) {
            if (fieldData.nested[parentId]) {
                fieldData.nested[parentId].forEach(field => {
                    renderFieldRow(field);
                    // 递归渲染更深层级的嵌套字段
                    renderNestedFields(field.id, field.nestedLevel);
                });
            }
        }

        // 为所有根字段渲染嵌套字段
        fieldData.root.forEach(field => {
            renderNestedFields(field.id, field.nestedLevel);
        });
    }

    /**
     * 渲染单个字段行
     * @param {object} field 字段数据
     */
    function renderFieldRow(field) {
        const tr = document.createElement('tr');
        tr.dataset.fieldId = field.id;

        // 计算缩进层级（最大5级）
        const indentLevel = Math.min(field.nestedLevel, 5);
        const indentClass = `indent-level-${indentLevel}`;

        // 1. 字段名称单元格
        const nameTd = document.createElement('td');
        nameTd.className = `cell-name ${indentClass}`;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'table-form-control';
        nameInput.value = field.name;
        nameInput.addEventListener('input', function () {
            updateField(field.id, 'name', this.value, field.arrayObjectKey);
        });

        nameTd.appendChild(nameInput);

        // 2. 数据类型单元格
        const typeTd = document.createElement('td');
        typeTd.className = `cell-type ${indentClass}`;

        const typeSelect = document.createElement('select');
        typeSelect.className = 'table-form-control';

        // 添加类型选项
        const types = [
            { value: 'string', label: '字符串' },
            { value: 'number', label: '数字' },
            { value: 'boolean', label: '布尔值' },
            { value: 'null', label: '空值' },
            { value: 'object', label: '对象' },
            { value: 'array', label: '数组' }
        ];

        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            option.selected = field.type === type.value;
            typeSelect.appendChild(option);
        });

        typeSelect.addEventListener('change', function () {
            updateField(field.id, 'type', this.value, field.arrayObjectKey);
        });

        typeTd.appendChild(typeSelect);

        // 3. 字段值单元格
        const valueTd = document.createElement('td');
        valueTd.className = `cell-value ${indentClass}`;

        // 根据类型渲染不同的值编辑器
        renderValueEditor(valueTd, field);

        // 如果是数组类型，渲染数组项
        if (field.type === 'array' && field.arrayItems.length > 0) {
            const arrayItemsContainer = document.createElement('div');
            arrayItemsContainer.className = 'array-item-list';

            field.arrayItems.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'array-item-row';

                // 数组项类型选择
                const itemTypeSelect = document.createElement('select');
                itemTypeSelect.className = 'table-form-control';
                itemTypeSelect.style.flex = '1';

                types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.value;
                    option.textContent = type.label;
                    option.selected = item.type === type.value;
                    itemTypeSelect.appendChild(option);
                });

                itemTypeSelect.addEventListener('change', function () {
                    updateArrayItem(field.id, item.id, 'type', this.value);
                });

                // 数组项值编辑器
                const itemValueContainer = document.createElement('div');
                itemValueContainer.style.flex = '2';
                renderArrayItemValueEditor(itemValueContainer, field.id, item);

                // 对象类型的添加字段按钮
                if (item.type === 'object') {
                    const addFieldBtn = document.createElement('button');
                    addFieldBtn.className = 'action-btn btn-nested action-btn-sm';
                    addFieldBtn.innerHTML = '<i class="fas fa-plus"></i>';
                    addFieldBtn.title = '添加字段';
                    addFieldBtn.addEventListener('click', function () {
                        addFieldToArrayObject(field.id, item.id);
                    });
                    itemRow.appendChild(addFieldBtn);

                    // 渲染数组对象的字段
                    const key = `${field.id}_${item.id}`;
                    if (fieldData.arrayObjectFields[key] && fieldData.arrayObjectFields[key].length > 0) {
                        const objectFieldsContainer = document.createElement('div');
                        objectFieldsContainer.className = 'array-object-fields';

                        fieldData.arrayObjectFields[key].forEach(objField => {
                            const objFieldRow = document.createElement('div');
                            objFieldRow.style.display = 'flex';
                            objFieldRow.style.gap = '6px';
                            objFieldRow.style.marginTop = '4px';

                            const objFieldName = document.createElement('input');
                            objFieldName.type = 'text';
                            objFieldName.className = 'table-form-control';
                            objFieldName.style.flex = '1';
                            objFieldName.value = objField.name;
                            objFieldName.addEventListener('input', function () {
                                updateField(objField.id, 'name', this.value, key);
                            });

                            const objFieldType = document.createElement('select');
                            objFieldType.className = 'table-form-control';
                            objFieldType.style.flex = '1';

                            types.forEach(type => {
                                const option = document.createElement('option');
                                option.value = type.value;
                                option.textContent = type.label;
                                option.selected = objField.type === type.value;
                                objFieldType.appendChild(option);
                            });

                            objFieldType.addEventListener('change', function () {
                                updateField(objField.id, 'type', this.value, key);
                            });

                            const objFieldValue = document.createElement('input');
                            objFieldValue.className = 'table-form-control';
                            objFieldValue.style.flex = '2';

                            if (objField.type === 'string') {
                                objFieldValue.type = 'text';
                                objFieldValue.value = objField.value || '';
                            } else if (objField.type === 'number') {
                                objFieldValue.type = 'number';
                                objFieldValue.value = objField.value || 0;
                            } else if (objField.type === 'boolean') {
                                objFieldValue.type = 'checkbox';
                                objFieldValue.checked = objField.value || false;
                            } else {
                                objFieldValue.type = 'text';
                                objFieldValue.value = objField.type;
                                objFieldValue.disabled = true;
                            }

                            objFieldValue.addEventListener('input', function () {
                                let value = this.value;
                                if (objField.type === 'number') {
                                    value = parseFloat(value) || 0;
                                } else if (objField.type === 'boolean') {
                                    value = this.checked;
                                }
                                updateField(objField.id, 'value', value, key);
                            });

                            const deleteObjFieldBtn = document.createElement('button');
                            deleteObjFieldBtn.className = 'action-btn btn-delete action-btn-sm';
                            deleteObjFieldBtn.innerHTML = '<i class="fas fa-times"></i>';
                            deleteObjFieldBtn.addEventListener('click', function () {
                                deleteField(objField.id, key);
                            });

                            objFieldRow.appendChild(objFieldName);
                            objFieldRow.appendChild(objFieldType);
                            objFieldRow.appendChild(objFieldValue);
                            objFieldRow.appendChild(deleteObjFieldBtn);

                            objectFieldsContainer.appendChild(objFieldRow);
                        });

                        itemRow.appendChild(objectFieldsContainer);
                    }
                }

                // 删除按钮
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-btn btn-delete action-btn-sm';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.title = '删除数组项';
                deleteBtn.addEventListener('click', function () {
                    deleteArrayItem(field.id, item.id);
                });

                itemRow.appendChild(itemTypeSelect);
                itemRow.appendChild(itemValueContainer);
                itemRow.appendChild(deleteBtn);

                arrayItemsContainer.appendChild(itemRow);
            });

            valueTd.appendChild(arrayItemsContainer);
        }

        // 4. 操作单元格
        const actionsTd = document.createElement('td');
        actionsTd.className = `cell-actions ${indentClass}`;

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // 添加子字段按钮（对象类型）
        if (field.type === 'object' && !field.arrayObjectKey) {
            const addChildBtn = document.createElement('button');
            addChildBtn.className = 'action-btn btn-nested action-btn-sm';
            addChildBtn.innerHTML = '<i class="fas fa-plus"></i> 字段';
            addChildBtn.title = '添加字段';
            addChildBtn.addEventListener('click', function () {
                addField('string', field.id, field.nestedLevel + 1);
            });
            actionButtons.appendChild(addChildBtn);

            const addChildObjBtn = document.createElement('button');
            addChildObjBtn.className = 'action-btn btn-nested action-btn-sm';
            addChildObjBtn.innerHTML = '<i class="fas fa-folder"></i> 对象';
            addChildObjBtn.title = '添加对象';
            addChildObjBtn.addEventListener('click', function () {
                addField('object', field.id, field.nestedLevel + 1);
            });
            actionButtons.appendChild(addChildObjBtn);

            const addChildArrayBtn = document.createElement('button');
            addChildArrayBtn.className = 'action-btn btn-nested action-btn-sm';
            addChildArrayBtn.innerHTML = '<i class="fas fa-list-ul"></i> 数组';
            addChildArrayBtn.title = '添加数组';
            addChildArrayBtn.addEventListener('click', function () {
                addField('array', field.id, field.nestedLevel + 1);
            });
            actionButtons.appendChild(addChildArrayBtn);
        }

        // 添加数组项按钮（数组类型）
        if (field.type === 'array') {
            const addItemBtn = document.createElement('button');
            addItemBtn.className = 'action-btn btn-add action-btn-sm';
            addItemBtn.innerHTML = '<i class="fas fa-plus"></i> 项';
            addItemBtn.title = '添加项';
            addItemBtn.addEventListener('click', function () {
                addArrayItem(field.id);
            });
            actionButtons.appendChild(addItemBtn);
        }

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn btn-delete action-btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', function () {
            if (confirm(`确定要删除字段 "${field.name}" 吗？`)) {
                deleteField(field.id, field.arrayObjectKey);
            }
        });

        actionButtons.appendChild(deleteBtn);
        actionsTd.appendChild(actionButtons);

        // 组装行
        tr.appendChild(nameTd);
        tr.appendChild(typeTd);
        tr.appendChild(valueTd);
        tr.appendChild(actionsTd);

        // 添加到表格
        fieldsTableBody.appendChild(tr);
    }

    /**
     * 渲染字段值编辑器
     * @param {HTMLElement} container 容器元素
     * @param {object} field 字段数据
     */
    function renderValueEditor(container, field) {
        container.innerHTML = '';

        switch (field.type) {
            case 'string':
                const stringInput = document.createElement('input');
                stringInput.type = 'text';
                stringInput.className = 'table-form-control';
                stringInput.value = field.value || '';
                stringInput.addEventListener('input', function () {
                    updateField(field.id, 'value', this.value, field.arrayObjectKey);
                });
                container.appendChild(stringInput);
                break;

            case 'number':
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.className = 'table-form-control';
                numberInput.value = field.value || 0;
                numberInput.addEventListener('input', function () {
                    updateField(field.id, 'value', parseFloat(this.value) || 0, field.arrayObjectKey);
                });
                container.appendChild(numberInput);
                break;

            case 'boolean':
                const radioGroup = document.createElement('div');
                radioGroup.className = 'radio-group';

                const trueRadio = createRadioButton('true', field.value === true, function () {
                    updateField(field.id, 'value', true, field.arrayObjectKey);
                });

                const falseRadio = createRadioButton('false', field.value === false, function () {
                    updateField(field.id, 'value', false, field.arrayObjectKey);
                });

                radioGroup.appendChild(trueRadio);
                radioGroup.appendChild(falseRadio);
                container.appendChild(radioGroup);
                break;

            case 'null':
                const nullText = document.createElement('span');
                nullText.textContent = 'null';
                nullText.className = 'type-badge type-null';
                container.appendChild(nullText);
                break;

            case 'object':
                const objectText = document.createElement('span');
                objectText.textContent = '{}';
                objectText.className = 'type-badge type-object';
                container.appendChild(objectText);
                break;

            case 'array':
                const arrayContainer = document.createElement('div');
                arrayContainer.style.display = 'flex';
                arrayContainer.style.alignItems = 'center';
                arrayContainer.style.gap = '8px';

                const arrayText = document.createElement('span');
                arrayText.textContent = `[] (${field.arrayItems.length})`;
                arrayText.className = 'type-badge type-array';
                arrayContainer.appendChild(arrayText);

                // 添加数组项按钮
                if (field.arrayItems.length === 0) {
                    const addItemBtn = document.createElement('button');
                    addItemBtn.className = 'action-btn btn-add action-btn-sm';
                    addItemBtn.innerHTML = '<i class="fas fa-plus"></i>';
                    addItemBtn.title = '添加项';
                    addItemBtn.addEventListener('click', function () {
                        addArrayItem(field.id);
                    });
                    arrayContainer.appendChild(addItemBtn);
                }

                container.appendChild(arrayContainer);
                break;
        }
    }

    /**
     * 渲染数组项值编辑器
     * @param {HTMLElement} container 容器元素
     * @param {number} fieldId 数组字段ID
     * @param {object} item 数组项数据
     */
    function renderArrayItemValueEditor(container, fieldId, item) {
        container.innerHTML = '';

        switch (item.type) {
            case 'string':
                const stringInput = document.createElement('input');
                stringInput.type = 'text';
                stringInput.className = 'table-form-control';
                stringInput.value = item.value || '';
                stringInput.addEventListener('input', function () {
                    updateArrayItem(fieldId, item.id, 'value', this.value);
                });
                container.appendChild(stringInput);
                break;

            case 'number':
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.className = 'table-form-control';
                numberInput.value = item.value || 0;
                numberInput.addEventListener('input', function () {
                    updateArrayItem(fieldId, item.id, 'value', parseFloat(this.value) || 0);
                });
                container.appendChild(numberInput);
                break;

            case 'boolean':
                const radioGroup = document.createElement('div');
                radioGroup.className = 'radio-group';

                const trueRadio = createRadioButton('true', item.value === true, function () {
                    updateArrayItem(fieldId, item.id, 'value', true);
                });

                const falseRadio = createRadioButton('false', item.value === false, function () {
                    updateArrayItem(fieldId, item.id, 'value', false);
                });

                radioGroup.appendChild(trueRadio);
                radioGroup.appendChild(falseRadio);
                container.appendChild(radioGroup);
                break;

            case 'null':
                const nullText = document.createElement('span');
                nullText.textContent = 'null';
                nullText.className = 'type-badge type-null';
                container.appendChild(nullText);
                break;

            case 'object':
                const objectText = document.createElement('span');
                objectText.textContent = '{}';
                objectText.className = 'type-badge type-object';
                container.appendChild(objectText);
                break;

            case 'array':
                const arrayText = document.createElement('span');
                arrayText.textContent = '[]';
                arrayText.className = 'type-badge type-array';
                container.appendChild(arrayText);
                break;
        }
    }

    /**
     * 创建单选按钮
     * @param {string} value 值
     * @param {boolean} checked 是否选中
     * @param {function} onChange 变更回调
     * @returns {HTMLElement} 单选按钮元素
     */
    function createRadioButton(value, checked, onChange) {
        const radioItem = document.createElement('div');
        radioItem.className = 'radio-item';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `boolean_${Math.random().toString(36).substr(2, 9)}`;
        radio.value = value;
        radio.checked = checked;
        radio.addEventListener('change', onChange);

        const label = document.createElement('label');
        label.textContent = value === 'true' ? '是' : '否';

        radioItem.appendChild(radio);
        radioItem.appendChild(label);

        return radioItem;
    }

    /**
     * 生成JSON数据
     * @returns {object} JSON对象
     */
    function generateJson() {
        const jsonData = {};

        // 处理根字段
        fieldData.root.forEach(field => {
            jsonData[field.name] = getFieldValue(field);
        });

        return jsonData;
    }

    /**
     * 获取字段值（递归处理嵌套结构）
     * @param {object} field 字段数据
     * @returns {any} 字段值
     */
    function getFieldValue(field) {
        switch (field.type) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
                return field.value;

            case 'object':
                const obj = {};
                // 处理嵌套字段
                if (fieldData.nested[field.id]) {
                    fieldData.nested[field.id].forEach(nestedField => {
                        obj[nestedField.name] = getFieldValue(nestedField);
                    });
                }
                return obj;

            case 'array':
                const arr = [];
                // 处理数组项
                field.arrayItems.forEach(item => {
                    let itemValue;

                    switch (item.type) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                        case 'null':
                            itemValue = item.value;
                            break;

                        case 'object':
                            // 处理数组中的对象
                            itemValue = {};
                            const key = `${field.id}_${item.id}`;
                            // 获取数组对象的字段
                            if (fieldData.arrayObjectFields[key]) {
                                fieldData.arrayObjectFields[key].forEach(objField => {
                                    itemValue[objField.name] = getFieldValue(objField);
                                });
                            }
                            break;

                        case 'array':
                            itemValue = []; // 这里可以扩展支持嵌套数组
                            break;

                        default:
                            itemValue = null;
                    }

                    arr.push(itemValue);
                });
                return arr;

            default:
                return '';
        }
    }

    /**
     * 更新JSON预览
     */
    function updateJsonPreview() {
        const jsonData = generateJson();
        const jsonString = JSON.stringify(jsonData, null, 2);

        // 语法高亮
        const highlightedJson = syntaxHighlight(jsonString);
        jsonPreview.innerHTML = highlightedJson;
    }

    /**
     * JSON语法高亮
     * @param {string} json JSON字符串
     * @returns {string} 高亮后的HTML
     */
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    /**
     * 显示通知
     * @param {string} message 通知消息
     */
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * 初始化示例数据
     */
    function initExampleFields() {
        // 添加姓名字段
        const nameFieldId = addField('string');
        updateField(nameFieldId, 'name', 'name');
        updateField(nameFieldId, 'value', '张三');

        // 添加年龄字段
        const ageFieldId = addField('number');
        updateField(ageFieldId, 'name', 'age');
        updateField(ageFieldId, 'value', 30);

        // 添加用户对象
        const userFieldId = addField('object');
        updateField(userFieldId, 'name', 'user');

        // 为用户对象添加子字段
        const userNameFieldId = addField('string', userFieldId, 1);
        updateField(userNameFieldId, 'name', 'username');
        updateField(userNameFieldId, 'value', 'zhangsan');

        const emailFieldId = addField('string', userFieldId, 1);
        updateField(emailFieldId, 'name', 'email');
        updateField(emailFieldId, 'value', 'zhangsan@example.com');

        // 添加地址对象
        const addressFieldId = addField('object', userFieldId, 1);
        updateField(addressFieldId, 'name', 'address');

        // 为地址对象添加子字段
        const cityFieldId = addField('string', addressFieldId, 2);
        updateField(cityFieldId, 'name', 'city');
        updateField(cityFieldId, 'value', '上海');

        const streetFieldId = addField('string', addressFieldId, 2);
        updateField(streetFieldId, 'name', 'street');
        updateField(streetFieldId, 'value', '南京路123号');

        // 添加爱好数组
        const hobbiesFieldId = addField('array');
        updateField(hobbiesFieldId, 'name', 'hobbies');

        // 为数组添加字符串项
        addArrayItem(hobbiesFieldId, 'string');
        updateArrayItem(hobbiesFieldId, 1, 'value', '阅读');

        addArrayItem(hobbiesFieldId, 'string');
        updateArrayItem(hobbiesFieldId, 2, 'value', '运动');

        // 添加产品数组（包含对象）
        const productsFieldId = addField('array');
        updateField(productsFieldId, 'name', 'products');

        // 添加对象类型的数组项
        addArrayItem(productsFieldId, 'object');

        // 为数组中的对象添加字段
        addFieldToArrayObject(productsFieldId, 3, 'string');
        const productNameField = fieldData.arrayObjectFields['4_3'][0];
        updateField(productNameField.id, 'name', 'productName', '4_3');
        updateField(productNameField.id, 'value', '手机', '4_3');

        addFieldToArrayObject(productsFieldId, 3, 'number');
        const productPriceField = fieldData.arrayObjectFields['4_3'][1];
        updateField(productPriceField.id, 'name', 'price', '4_3');
        updateField(productPriceField.id, 'value', 2999, '4_3');

        // 更新预览
        updateJsonPreview();
    }

    // 初始化示例数据
    initExampleFields();
});