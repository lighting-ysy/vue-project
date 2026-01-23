<template>
  <div class="contract-wrapper">
    <!-- 合同标题 -->
    <div class="contract-header text-center mb-8">
      <h1 class="contract-title font-bold text-xl">
        {采购项目名称}-{采购包名称}(第{X}包)
      </h1>
      <h2 class="contract-subtitle font-bold text-lg mt-2">政府采购合同</h2>
      <div class="contract-no mt-4">合同编号：<span class="text-gray-600 font-mono">{(系统生成,不可编辑)XX}</span></div>
      <div class="contract-no mt-4">
          <span class="label inline-block w-28">采购人(甲方)：</span>
          <span class="value font-mono">{(继承信息,不可编辑)采购单位名称}</span>
        </div>
        <div class="contract-no mt-4">
          <span class="label inline-block w-28">供应商(乙方)：</span>
          <span class="value font-mono">{(继承信息,不可编辑)供应商名称}</span>
        </div>
        <div class="contract-no mt-4">
          <span class="label inline-block w-28">签订地点：<el-input v-model="signPlace" class="inline-input w-64" placeholder="请填写签订地点"></el-input></span>
          
        </div>
        <div class="contract-no mt-4">
          <span class="label inline-block w-28">签订时间：</span>
          <span class="value font-mono">{(取值供应商签章时间,不可编辑)}</span>
        </div>
    </div>

    <!-- 合同主体 -->
    <div class="contract-body">
      <!-- 签约方信息 -->
      <div class="party-info mb-6">
        
      </div>

      <!-- 合同前言 -->
      <div class="preamble mb-6 text-indent-2">
        根据《中华人民共和国民法典》《中华人民共和国政府采购法》等法律法规，以及本采购项目的采购文件、乙方的《投标(响应)文件》及《中标(成交)通知书》，甲乙双方同意签订本合同，共同遵守如下条款：
      </div>

      <!-- 一、项目信息 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">一、项目信息</h3>
        
        <div class="section-content">
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">1.1 采购项目名称：</span>
            <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">1.2 采购项目编号：</span>
            <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">1.3 采购计划编号：</span>
            <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">1.4 政府采购组织形式：</span>
            <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">1.5 政府采购方式：</span>
            <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
          </div>

          <!-- 1.6 落实政府采购政策情况 -->
          <div class="policy-section mt-4 mb-4 pl-4 border-l-2 border-gray-300">
            <h4 class="policy-title font-bold mb-3">1.6 落实政府采购政策情况：</h4>
            <div class="policy-items grid grid-cols-2 gap-x-8 gap-y-2">
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.1 制造商是否为中小企业：</span>
                <el-select v-model="policy.isSme" class="inline-select w-24" placeholder="请选择">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.2 是否专门面向中小企业：</span>
                <span class="value font-mono">{(继承信息,不可编辑)是/否}</span>
              </div>
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.3 是否给予小微企业评审优惠：</span>
                <span class="value font-mono">{(继承信息,不可编辑)是/否}</span>
              </div>
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.4 是否为残疾人福利性单位：</span>
                <el-select v-model="policy.isDisabledWelfare" class="inline-select w-24" placeholder="请选择">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.5 是否为监狱企业：</span>
                <el-select v-model="policy.isPrisonEnterprise" class="inline-select w-24" placeholder="请选择">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
              <div class="policy-item">
                <span class="policy-label inline-block w-56">1.6.6 是否为外商投资企业：</span>
                <el-select v-model="policy.isForeignInvested" class="inline-select w-24" @change="handleForeignChange" placeholder="请选择">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
              <div v-if="policy.isForeignInvested === 'true'" class="policy-item col-span-2">
                <span class="policy-label inline-block w-56">外商投资企业类型：</span>
                <el-select v-model="policy.foreignType" class="inline-select w-48" placeholder="请选择">
                  <el-option label="全部由外国投资者投资" value="full"></el-option>
                  <el-option label="部分由外国投资者投资" value="partial"></el-option>
                </el-select>
              </div>
            </div>
          </div>

          <!-- 1.8 项目内容表格 -->
          <div class="project-table mt-6 mb-6">
            <h4 class="table-title font-bold mb-3">1.8 项目内容：</h4>
            <el-table :data="targetList" border class="contract-table" :header-cell-style="tableHeaderStyle">
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="标的名称" align="center">
                <template #default="scope">
                  <span v-if="!scope.row.editable" class="font-mono">{(继承信息,不可编辑)XX}</span>
                  <el-input v-else v-model="scope.row.name" class="font-mono"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="单价(元)" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.price" type="number" :disabled="!scope.row.editable" class="font-mono text-right"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.quantity" type="number" :disabled="!scope.row.editable" class="font-mono text-right"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="金额(元)" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.amount" type="number" :disabled="!scope.row.editable" class="font-mono text-right"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="计量单位" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.unit" :disabled="!scope.row.editable" class="font-mono"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="品牌" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.brand" :disabled="!scope.row.editable" class="font-mono"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="规格型号" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.spec" :disabled="!scope.row.editable" class="font-mono"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
                  <el-button size="mini" @click="scope.row.editable = !scope.row.editable" class="text-xs">
                    {{ scope.row.editable ? '取消' : '编辑' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" @click="addTarget" class="mt-2 text-blue-600">+ 新增标的</el-button>
          </div>

          <!-- 条件显示模块 -->
          <!-- 信息类产品 -->
          <div class="condition-module mt-6">
            <el-checkbox v-model="showModules.infoProduct" label="涉及信息类产品"></el-checkbox>
            <div v-if="showModules.infoProduct" class="module-content mt-3 border border-gray-300 p-4">
              <h4 class="module-title font-bold mb-3">信息类产品关键部件信息：</h4>
              <el-table :data="infoProductList" border class="contract-table" :header-cell-style="tableHeaderStyle">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="标的名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.name" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="关键部件" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.keyPart" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="品牌" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.brand" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="型号" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.model" class="font-mono"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <p class="text-xs text-gray-500 mt-2">注：关键部件是指财政部会同有关部门发布的政府采购需求标准规定的需要通过国家有关部门指定的测评机构开展的安全可靠测评的软硬件，如CPU芯片、操作系统、数据库等。</p>
            </div>
          </div>

          <!-- 新能源汽车 -->
          <div class="condition-module mt-4">
            <el-checkbox v-model="showModules.newEnergyCar" label="涉及采购新能源汽车"></el-checkbox>
            <div v-if="showModules.newEnergyCar" class="module-content mt-3 border border-gray-300 p-4">
              <h4 class="module-title font-bold mb-3">新能源汽车采购信息：</h4>
              <el-table :data="newEnergyCarList" border class="contract-table" :header-cell-style="tableHeaderStyle">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="采购品目名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.category" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.quantity" type="number" class="font-mono text-right"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="金额(元)" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.amount" type="number" class="font-mono text-right"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 合同分包 -->
          <div class="condition-module mt-4">
            <el-checkbox v-model="showModules.subcontract" label="涉及合同分包"></el-checkbox>
            <div v-if="showModules.subcontract" class="module-content mt-3 border border-gray-300 p-4">
              <h4 class="module-title font-bold mb-3">合同分包信息：</h4>
              <el-table :data="subcontractList" border class="contract-table" :header-cell-style="tableHeaderStyle">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="分包方式" align="center">
                  <template #default="scope">
                    <span class="font-mono">{(继承信息,不可编辑)XX}</span>
                  </template>
                </el-table-column>
                <el-table-column label="分包主要内容" align="center">
                  <template #default="scope">
                    <span class="font-mono">{(继承信息,不可编辑)XX}</span>
                  </template>
                </el-table-column>
                <el-table-column label="分包供应商/制造商名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.supplier" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="分包供应商/制造商类型" align="center">
                  <template #default="scope">
                    <el-select v-model="scope.row.type" class="font-mono">
                      <el-option label="大型企业" value="large"></el-option>
                      <el-option label="中型企业" value="medium"></el-option>
                      <el-option label="小微型企业" value="micro"></el-option>
                      <el-option label="残疾人福利性单位" value="disabled"></el-option>
                      <el-option label="监狱企业" value="prison"></el-option>
                      <el-option label="其他" value="other"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <p class="text-xs text-gray-500 mt-2">注：如供应商和制造商不同，请分别填写；如果供应商和制造商不同，只填写制造商类型。</p>
            </div>
          </div>

          <!-- 其他条件模块（进口产品、节能产品等） -->
          <div class="condition-module mt-4">
            <el-checkbox v-model="showModules.importProduct" label="涉及采购进口产品"></el-checkbox>
            <div v-if="showModules.importProduct" class="module-content mt-3 border border-gray-300 p-4">
              <h4 class="module-title font-bold mb-3">进口产品采购信息：</h4>
              <el-table :data="importProductList" border class="contract-table" :header-cell-style="tableHeaderStyle">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="采购品目名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.category" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="标的名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.name" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.productName" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="品牌" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.brand" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="规格型号" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.spec" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="金额(元)" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.amount" type="number" class="font-mono text-right"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="国别" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.country" class="font-mono"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <!-- 二、货物要求 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">二、货物要求</h3>
        <div class="section-content pl-4">
          <div class="requirement-item mb-4">
            <h4 class="requirement-title font-bold mb-2">2.1 质量要求：</h4>
            <el-input v-model="goodsRequirements.quality" type="textarea" :rows="4" class="contract-textarea font-sans"></el-input>
          </div>
          
          <div class="requirement-item mb-4">
            <h4 class="requirement-title font-bold mb-2">2.2 包装方式及运输方式：</h4>
            <el-input v-model="goodsRequirements.packaging" type="textarea" :rows="2" class="contract-textarea font-sans"></el-input>
          </div>
          
          <div class="requirement-item mb-4">
            <h4 class="requirement-title font-bold mb-2">2.3 质量保修范围和保修期：</h4>
            <el-input v-model="goodsRequirements.warranty" type="textarea" :rows="4" class="contract-textarea font-sans"></el-input>
          </div>
          
          <div class="requirement-item mb-4">
            <h4 class="requirement-title font-bold mb-2">2.4 其他要求：</h4>
            <el-input v-model="goodsRequirements.other" type="textarea" :rows="2" class="contract-textarea font-sans"></el-input>
          </div>
        </div>
      </div>

      <!-- 三、合同价款、支付方式和付款进度安排 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">三、合同价款、支付方式和付款进度安排</h3>
        <div class="section-content pl-4">
          <div class="price-info mb-4">
            <div class="info-row mb-2">
              <span class="section-label inline-block w-36">3.1 合同价款：</span>
              <div class="price-content">
                <span class="inline-block mr-4">本合同总金额为 <span class="font-mono font-bold text-red-600">{{ totalAmount }}</span> 元</span>
                <span class="inline-block">（大写：<span class="font-mono">{{ totalAmountUpper }}</span>）</span>
              </div>
            </div>
            
            <div class="quote-type mt-2 pl-36">
              <el-radio-group v-model="quoteType" class="mr-6">
                <el-radio label="total">总价模式</el-radio>
                <el-radio label="unit">单价模式</el-radio>
                <el-radio label="percent">百分比模式</el-radio>
                <el-radio label="combine">组合报价模式</el-radio>
              </el-radio-group>
              
              <div v-if="quoteType === 'unit'" class="quote-note mt-2 text-sm text-gray-600">
                本合同为单价结算方式，具体结算以实际发生的服务量及合同约定的单价据实结算，但不得超过本合同总金额。
              </div>
              <div v-if="quoteType === 'percent'" class="quote-note mt-2 text-sm text-gray-600">
                本合同按合同履行过程中实际发生时的价格乘以乙方所报百分比据实结算，但不得超过本合同总金额。
              </div>
            </div>
            
            <div class="other-note mt-3">
              <span class="section-label inline-block w-36">其他情况说明：</span>
              <el-input v-model="otherNote" class="inline-input w-96"></el-input>
            </div>
          </div>

          <div class="payment-info mb-4">
            <div class="info-row mb-3">
              <span class="section-label inline-block w-36">3.2 支付方式：</span>
              <el-select v-model="paymentMethod" class="inline-select w-32">
                <el-option label="once">一次性支付</el-option>
                <el-option label="installment">分期付款</el-option>
              </el-select>
            </div>

            <div class="payment-schedule mt-4">
              <h4 class="schedule-title font-bold mb-2">3.3 付款进度安排：</h4>
              <el-table :data="paymentSchedule" border class="contract-table" :header-cell-style="tableHeaderStyle">
                <el-table-column label="期次" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="支付金额(元)" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.amount" type="number" class="font-mono text-right"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="计划支付日期" align="center">
                  <template #default="scope">
                    <el-date-picker v-model="scope.row.date" type="date" class="font-mono"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="收款人" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.payee" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="支付说明" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.note" class="font-mono"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="是否预付款" align="center">
                  <template #default="scope">
                    <el-switch v-model="scope.row.isAdvance"></el-switch>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="text" @click="addPaymentSchedule" class="mt-2 text-blue-600">+ 新增付款期次</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 四至十二 其他条款（简化展示核心部分） -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">四、合同履行</h3>
        <div class="section-content pl-4">
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">4.1 交货时间：</span>
            <el-date-range-picker v-model="deliveryTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="font-mono"></el-date-range-picker>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">4.2 交货地点：</span>
            <el-input v-model="deliveryPlace" class="inline-input w-64 font-mono"></el-input>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">4.3 分期履行要求：</span>
            <el-input v-model="installmentReq" class="inline-input w-96 font-mono"></el-input>
          </div>
          <div class="info-row mb-2">
            <span class="section-label inline-block w-36">4.4 风险处置措施和替代方案：</span>
            <el-input v-model="riskMeasure" type="textarea" :rows="2" class="contract-textarea font-sans"></el-input>
          </div>
        </div>
      </div>

      <!-- 违约责任、争议解决等核心条款 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">八、违约责任</h3>
        <div class="section-content pl-4">
          <el-input v-model="breachTerms" type="textarea" :rows="6" class="contract-textarea font-sans"></el-input>
        </div>
      </div>

      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">九、争议解决方法</h3>
        <div class="section-content pl-4">
          <el-input v-model="disputeTerms" type="textarea" :rows="4" class="contract-textarea font-sans"></el-input>
        </div>
      </div>

      <!-- 组成合同的文件 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">十、组成合同的文件</h3>
        <div class="section-content pl-4">
          <p class="mb-2">本合同与下列文件一起构成合同文件，如下述文件之间有任何抵触、矛盾或歧义，应按以下顺序解释：</p>
          <ol class="list-decimal pl-8 space-y-1 font-mono">
            <li>政府采购合同及其变更、补充协议</li>
            <li>中标(成交)通知书</li>
            <li>投标(响应)文件</li>
            <li>采购文件</li>
            <li>有关技术文件、图纸</li>
            <li>国家法律、行政法规和规章制度规定或合同约定的作为合同组成部分的其他文件</li>
          </ol>
        </div>
      </div>

      <!-- 其他条款 -->
      <div class="contract-section mb-6">
        <h3 class="section-title font-bold text-lg mb-4">十一、其他条款</h3>
        <div class="section-content pl-4 space-y-4">
          <!-- 履约保证金 -->
          <div class="other-term-item">
            <h4 class="term-title font-bold mb-2">11.1 履约保证金：</h4>
            <el-checkbox v-model="hasDeposit" label="收取履约保证金"></el-checkbox>
            <div v-if="hasDeposit" class="deposit-content mt-2 pl-6 grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span class="term-label inline-block w-32">保证金金额：</span>
                <el-input v-model="depositAmount" type="number" class="inline-input w-32 font-mono">元</el-input>
              </div>
              <div>
                <span class="term-label inline-block w-32">收取比例：</span>
                <span class="value font-mono">{(继承信息,不可编辑)XX}%</span>
              </div>
              <div>
                <span class="term-label inline-block w-32">收取方式：</span>
                <el-select v-model="depositMethod" class="inline-select w-36 font-mono">
                  <el-option label="transfer">银行转账</el-option>
                  <el-option label="check">支票(汇票/本票)</el-option>
                  <el-option label="guarantee">保函(保险)</el-option>
                  <el-option label="paperGuarantee">纸质保函(保险)</el-option>
                </el-select>
              </div>
              <div>
                <span class="term-label inline-block w-32">收款单位：</span>
                <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
              </div>
              <div>
                <span class="term-label inline-block w-32">开户行：</span>
                <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
              </div>
              <div>
                <span class="term-label inline-block w-32">银行账号：</span>
                <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
              </div>
              <div>
                <span class="term-label inline-block w-32">退还方式：</span>
                <span class="value font-mono">{(继承信息,不可编辑)XX}</span>
              </div>
              <div>
                <span class="term-label inline-block w-32">退还时间：</span>
                <el-date-picker v-model="depositRefundTime" type="date" class="font-mono"></el-date-picker>
              </div>
            </div>
          </div>

          <!-- 不可抗力、知识产权等固定条款 -->
          <div class="other-term-item">
            <h4 class="term-title font-bold mb-2">11.2 不可抗力事件处理：</h4>
            <el-input v-model="forceMajeure" type="textarea" :rows="3" class="contract-textarea font-sans"></el-input>
          </div>

          <div class="other-term-item">
            <h4 class="term-title font-bold mb-2">11.4 知识产权保护：</h4>
            <el-input v-model="ipProtection" type="textarea" :rows="2" class="contract-textarea font-sans"></el-input>
          </div>

          <div class="other-term-item">
            <h4 class="term-title font-bold mb-2">11.5 保密义务：</h4>
            <el-input v-model="confidentiality" type="textarea" :rows="2" class="contract-textarea font-sans"></el-input>
          </div>

          <div class="other-term-item">
            <h4 class="term-title font-bold mb-2">11.6 售后服务：</h4>
            <el-input v-model="afterSales" type="textarea" :rows="3" class="contract-textarea font-sans"></el-input>
          </div>
        </div>
      </div>

      <!-- 合同生效及其他 -->
      <div class="contract-section mb-8">
        <h3 class="section-title font-bold text-lg mb-4">十二、合同生效及其他</h3>
        <div class="section-content pl-4">
          <el-input v-model="effectiveTerms" type="textarea" :rows="3" class="contract-textarea font-sans mb-4"></el-input>
          
          <div class="copy-info mb-4">
            <span class="section-label inline-block w-36">合同份数：</span>
            <el-input v-model="copyCount" type="number" class="inline-input w-16 font-mono">份</el-input>
            <span class="ml-4">（甲方持有 <el-input v-model="partyACopy" type="number" class="inline-input w-10 font-mono">份</el-input>，乙方持有 <el-input v-model="partyBCopy" type="number" class="inline-input w-10 font-mono">份</el-input>，项目同级财政部门备案 <el-input v-model="fileCopy" type="number" class="inline-input w-10 font-mono">份</el-input>）</span>
          </div>
        </div>
      </div>

      <!-- 签章区域 -->
      <div class="seal-area mt-10">
        <div class="seal-container grid grid-cols-2 gap-8">
          <!-- 甲方签章 -->
          <div class="party-seal border border-gray-300 p-6">
            <h3 class="party-title font-bold text-center mb-6">甲方（采购人）</h3>
            <div class="seal-info space-y-3">
              <div class="info-row">
                <span class="seal-label inline-block w-24">单位名称：</span>
                <span class="value font-mono font-bold">{(继承信息,不可编辑)采购单位名称}</span>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">法定代表人或<br>授权委托代理人：</span>
                <div class="seal-sign w-40 h-12 border-b border-gray-400 mt-2"></div>
                <span class="block mt-1 text-xs text-gray-500">（签章）</span>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">住所：</span>
                <el-input v-model="partyA.address" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">开户银行：</span>
                <el-input v-model="partyA.bank" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">银行账号：</span>
                <el-input v-model="partyA.bankAccount" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="seal-image mt-4 text-center">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleSealUpload"
                  accept="image/*"
                >
                  <el-button size="small" type="primary">上传公章</el-button>
                </el-upload>
              </div>
            </div>
          </div>

          <!-- 乙方签章 -->
          <div class="party-seal border border-gray-300 p-6">
            <h3 class="party-title font-bold text-center mb-6">乙方（供应商）</h3>
            <div class="seal-info space-y-3">
              <div class="info-row">
                <span class="seal-label inline-block w-24">单位名称：</span>
                <span class="value font-mono font-bold">{(继承信息,不可编辑)供应商名称}</span>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">法定代表人或<br>授权委托代理人：</span>
                <div class="seal-sign w-40 h-12 border-b border-gray-400 mt-2"></div>
                <span class="block mt-1 text-xs text-gray-500">（签章）</span>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">住所：</span>
                <el-input v-model="partyB.address" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">开户银行：</span>
                <el-input v-model="partyB.bank" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="info-row">
                <span class="seal-label inline-block w-24">银行账号：</span>
                <el-input v-model="partyB.bankAccount" class="inline-input w-48 font-mono"></el-input>
              </div>
              <div class="seal-image mt-4 text-center">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleSealUpload"
                  accept="image/*"
                >
                  <el-button size="small" type="primary">上传公章</el-button>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group text-center mt-10 mb-6" style="display: flex; justify-content: space-between;">
        <el-button type="primary" size="default" @click="submitContract" class="mr-4">提交合同</el-button>
        <el-button type="success" size="default" @click="exportContract" class="mr-4">导出PDF</el-button>
        <el-button type="info" size="default" @click="saveDraft" class="mr-4">保存草稿</el-button>
        <el-button type="danger" size="default" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 基础信息
const signPlace = ref('');

// 政府采购政策信息
const policy = reactive({
  isSme: '',
  isDisabledWelfare: '',
  isPrisonEnterprise: '',
  isForeignInvested: '',
  foreignType: ''
});

// 标的列表
const targetList = ref([
  {
    name: '',
    price: '',
    quantity: '',
    amount: '',
    unit: '',
    brand: '',
    spec: '',
    editable: false
  }
]);

// 条件显示模块控制
const showModules = reactive({
  infoProduct: false,
  newEnergyCar: false,
  subcontract: false,
  importProduct: false,
  energySaving: false,
  envMark: false,
  greenProduct: false
});

// 信息类产品列表
const infoProductList = ref([
  { name: '', keyPart: '', brand: '', model: '' }
]);

// 新能源汽车列表
const newEnergyCarList = ref([
  { category: '', quantity: '', amount: '' }
]);

// 分包列表
const subcontractList = ref([
  { supplier: '', type: '' }
]);

// 进口产品列表
const importProductList = ref([
  { category: '', name: '', productName: '', brand: '', spec: '', amount: '', country: '' }
]);

// 货物要求
const goodsRequirements = reactive({
  quality: '1. 乙方所提供的货物应符合合同约定的品牌、规格型号、技术性能、配置、质量、数量等要求。质量要求不明确的，按照强制性国家标准履行；没有强制性国家标准的，按照推荐性国家标准履行；没有推荐性国家标准的，按照行业标准履行；没有国家标准、行业标准的，按照通常标准或者符合合同目的的特定标准履行。\n2. 乙方所提供的所有货物、辅材中属于《国家强制性货物认证目录》范围内货物的，均通过国家强制性货物认证并取得认证证书。\n3. 乙方所提供的货物应符合国家有关安全、环保、卫生的规定。\n4. 乙方应向甲方提交所提供货物的技术文件，包括相应的中文技术文件，如：产品目录、图纸、操作手册、使用说明、维护手册或服务指南等。上述文件应包装好随货物一同发运。',
  packaging: '涉及的商品包装和快递包装，均应符合《商品包装政府采购需求标准(试行)》《快递包装政府采购需求标准(试行)》的要求，包装应适应于远距离运输、防潮、防震、防锈和防野蛮装卸，以确保货物安全无损运抵指定地点。',
  warranty: '1. 乙方应保证提供的货物完全符合合同规定的质量、规格和性能要求。乙方应保证货物在正确安装、正常使用和保养条件下，在其使用寿命期内具备合同约定的性能。存在保修期的，货物最终交付验收合格后在采购文件规定的保修期或者乙方书面承诺(两者以较长的为准)的保修期内，本保证保持有效。\n2. 在保修期内所发现的缺陷，甲方应尽快以书面形式通知乙方。\n3. 乙方收到通知后，应在 日内以合理的速度免费维修或更换有缺陷的货物或部件。\n4. 在保修期内，如果货物的质量或规格与合同不符，或证实货物是有缺陷的，包括潜在的缺陷或使用不符合要求的材料等，甲方可以根据本合同第8.1条规定以书面形式追究乙方的违约责任。',
  other: ''
});

// 报价模式
const quoteType = ref('total');
const otherNote = ref('');

// 合同金额
const totalAmount = computed(() => {
  return targetList.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2);
});

// 大写金额（简化实现，实际项目需完整转换逻辑）
const totalAmountUpper = computed(() => {
  // 实际项目中应实现数字转大写金额的完整逻辑
  return '人民币' + totalAmount.value.replace(/\./, '元') + '角分';
});

// 支付方式
const paymentMethod = ref('once');

// 付款进度
const paymentSchedule = ref([
  { amount: '', date: '', payee: '', note: '', isAdvance: false }
]);

// 违约责任
const breachTerms = ref('8.1 质量瑕疵的违约责任：乙方提供的产品不符合合同约定的质量标准或存在产品质量缺陷，甲方有权要求乙方及时修理、重作、更换，并承担由此给甲方造成的损失。修理、重作、更换的具体要求为：\n8.2 迟延交货的违约责任：乙方未按合同规定时间交货的，甲方有权从货款中扣除误期赔偿费，赔偿费的计算方法为：\n8.3 迟延支付的违约责任：甲方存在迟延支付合同款项的，应当支付逾期付款利息，计算方法为：\n8.4 违法分包、转包的违约责任：乙方将项目转包、违法分包的，甲方可以解除合同，并要求乙方承担如下违约责任：');

// 争议解决
const disputeTerms = ref('9.1 因本合同及合同有关事项发生的争议，由甲乙双方友好协商解决。协商不成时，可以向有关组织申请调解。合同一方或双方不愿调解或调解不成的，可以通过仲裁或诉讼的方式解决争议。\n9.2 因本合同及合同有关事项发生的争议，向 仲裁委员会申请仲裁/向 人民法院起诉。\n9.3 如甲乙双方有争议的事项不影响合同其他部分的履行，在争议解决期间，合同其他部分应当继续履行。');

// 履约保证金
const hasDeposit = ref(false);
const depositAmount = ref('');
const depositMethod = ref('transfer');
const depositRefundTime = ref('');

// 其他条款内容
const forceMajeure = ref('11.2.1 任何一方对由于不可抗力造成的部分或全部不能履行合同不承担违约责任。但迟延履行后发生不可抗力的，不能免除责任。\n11.2.2 遇有不可抗力的一方，应及时将事件情况以书面形式告知另一方，并在事件发生后 天内及时向另一方提交合同不能履行或部分不能履行或需要延期履行的详细报告，以及证明不可抗力发生及其持续时间的证据。\n11.2.3 不可抗力事件延续 天以上，双方应通过友好协商，确定是否继续履行合同。');

const ipProtection = ref('乙方对其所销售的货物应当享有知识产权或经权利人合法授权，保证没有侵犯任何第三人的知识产权等权利。因违反前述约定对第三人构成侵权的，应当由乙方向第三人承担法律责任；甲方依法向第三人赔偿后，有权向乙方追偿。甲方有其他损失的，乙方应当赔偿。');

const confidentiality = ref('甲、乙双方对采购和合同履行过程中所获悉的国家秘密、工作秘密、商业秘密或者其他应当保密的信息，均有保密义务且不受合同有效期所限，直至该信息成为公开信息。泄露、不正当地使用国家秘密、工作秘密、商业秘密或者其他应当保密的信息，应当承担相应责任。');

const afterSales = ref('除项目不涉及或采购活动中明确约定无须承担外，乙方还应提供下列服务：\n(1) 货物的现场移动、安装、调试、启动监督及技术支持；\n(2) 提供货物组装和维修所需的专用工具和辅助材料；\n(3) 在 期限内对所有的货物实施运行监督、维修，但前提条件是该服务并不能免除乙方在质量保证期内所承担的义务；\n(4) 在制造商所在地或指定现场就货物的安装、启动、运营、维护、废弃处置等对甲方操作人员进行培训；\n(5) 依照法律、行政法规的规定或者因 原因，货物在有效使用年限届满后应予回收的，乙方负有自行或者委托第三人对货物予以回收的义务。\n乙方提供的售后服务的费用已包含在合同价款中，甲方不再另行支付。');

// 合同生效条款
const effectiveTerms = ref('12.1 合同经双方法定代表人(或主要负责人)或授权委托代理 人签字并加盖公章后生效。\n12.2 政府采购合同履行中，甲方需追加与合同标的相同的货物 的，在不改变合同其他条款的前提下签订的补充合同，报政府采购监 督管理部门备案，方可作为主合同不可分割的一部分。\n12.3 本合同一式 份，自双方签章之日起生效。甲方持有 份，乙方持有 份，项目同级财政部门备案 份，均具有同等法律效力。');

// 合同份数
const copyCount = ref(6);
const partyACopy = ref(2);
const partyBCopy = ref(2);
const fileCopy = ref(2);

// 甲乙双方信息
const partyA = reactive({
  address: '',
  bank: '',
  bankAccount: ''
});

const partyB = reactive({
  address: '',
  bank: '',
  bankAccount: ''
});

// 方法
const handleForeignChange = (value) => {
  if (value === 'false') {
    policy.foreignType = '';
  }
};

const addTarget = () => {
  targetList.value.push({
    name: '',
    price: '',
    quantity: '',
    amount: '',
    unit: '',
    brand: '',
    spec: '',
    editable: false
  });
};

const addPaymentSchedule = () => {
  paymentSchedule.value.push({
    amount: '',
    date: '',
    payee: '',
    note: '',
    isAdvance: false
  });
};

const handleSealUpload = (uploadFile) => {
  ElMessage.success('公章上传成功');
};

const submitContract = () => {
  ElMessageBox.confirm(
    '确认提交合同？提交后将无法修改',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('合同提交成功');
  }).catch(() => {
    ElMessage.info('已取消提交');
  });
};

const exportContract = () => {
  ElMessage.info('正在导出PDF...');
};

const saveDraft = () => {
  ElMessage.success('草稿保存成功');
};

const resetForm = () => {
  ElMessageBox.confirm(
    '确认重置表单？所有已填写数据将丢失',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 重置逻辑
    signPlace.value = '';
    Object.keys(policy).forEach(key => {
      policy[key] = '';
    });
    ElMessage.success('表单已重置');
  }).catch(() => {
    ElMessage.info('已取消重置');
  });
};

// 表格样式
const tableHeaderStyle = {
  'background-color': '#f5f5f5',
  'font-weight': 'bold',
  'text-align': 'center',
  'font-size': '14px'
};
</script>

<style scoped>
/* 基础样式 */
.contract-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  font-family: "SimSun", "宋体", serif;
  line-height: 1.8;
  color: #333;
}

/* 文本对齐和缩进 */
.text-center {
  text-align: center;
}

.text-indent-2 {
  text-indent: 2em;
}

/* 间距样式 */
.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-8 {
  margin-bottom: 32px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-6 {
  margin-top: 24px;
}

.mt-10 {
  margin-top: 40px;
}

.pl-4 {
  padding-left: 16px;
}

.pl-6 {
  padding-left: 24px;
}

.pl-8 {
  padding-left: 32px;
}

/* 字体样式 */
.font-bold {
  font-weight: bold;
}

.font-mono {
  font-family: "Consolas", "Monaco", monospace;
}

.font-sans {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-sm {
  font-size: 14px;
}

.text-xs {
  font-size: 12px;
}

.text-gray-500 {
  color: #666;
}

.text-gray-600 {
  color: #444;
}

.text-red-600 {
  color: #dc3545;
}

.text-blue-600 {
  color: #0d6efd;
}

/* 布局样式 */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.gap-x-8 {
  column-gap: 32px;
}

.gap-y-2 {
  row-gap: 8px;
}

.space-y-1 > * + * {
  margin-top: 4px;
}

.space-y-2 > * + * {
  margin-top: 8px;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

/* 表单样式 */
.inline-input {
  display: inline-block;
  vertical-align: middle;
}

.inline-select {
  display: inline-block;
  vertical-align: middle;
}

.contract-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  line-height: 1.6;
}

/* 表格样式 */
.contract-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.contract-table th,
.contract-table td {
  border: 1px solid #333;
  padding: 8px;
}

/* 签章区域样式 */
.seal-container {
  position: relative;
}

.party-seal {
  position: relative;
  min-height: 380px;
}

.seal-sign {
  display: inline-block;
  vertical-align: middle;
}

.seal-image {
  margin-top: 20px;
}

/* 标签样式 */
.label {
  font-weight: bold;
}

.section-label {
  font-weight: bold;
}

.policy-label {
  font-weight: normal;
}

.term-label {
  font-weight: normal;
}

.seal-label {
  font-weight: bold;
}

/* 按钮组样式 */
.button-group {
  margin-top: 40px;
}

/* 响应式调整 */
@media print {
  .contract-wrapper {
    padding: 0;
  }
  
  .button-group {
    display: none;
  }
  
  .contract-table th,
  .contract-table td {
    border-color: #000;
  }
}
</style>