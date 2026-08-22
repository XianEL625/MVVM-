<template>
  <div>
    <input v-model="text">
    <p>你输入的内容是：{{text}}</p>
  </div>
<hr>
  <div>
    <form @submit.prevent="submitForm1">
      <div>
        <label>文本输入:</label>
        <input id="textInput" v-model="formData.textInput" type="text" />
      </div>

      <div>
        <p>单选按钮:</p>
        <label>
          <input type="radio" value="选项1" v-model="formData.radioInput" />
          选项1
        </label>
        <label>
          <input type="radio" value="选项2" v-model="formData.radioInput" />
          选项2
        </label>
      </div>

      <div>
        <p>复选框:</p>
        <label>
          <input type="checkbox" value="选项A" v-model="formData.checkboxes" />
          选项 A
        </label>
        <label>
          <input type="checkbox" value="选项B" v-model="formData.checkboxes" />
          选项 B
        </label>
      </div>

      <div>
        <label for="selectInput">选择框:</label>
        <select id="selectInput" v-model="formData.selectInput">
          <option disabled value="">请选择</option>
          <option value="选项1">选项1</option>
          <option value="选项2">选项2</option>
          <option value="选项3">选项3</option>
        </select>
      </div>
      <button type="submit">提交</button>
      <p v-if="formError" class="error">{{ formError }}</p>
    </form>
    <div v-if="submittedData">
      <h3>您输入的数据：</h3>
      <pre>{{ submittedData }}</pre>
    </div>
  </div>
<hr>
  <div>
    <form @submit.prevent="submitForm2">
      <div v-for="(emailInput, index) in emailInputs" :key="index">
        <input :value="emailInput" type="email" @input="updateEmailInput(index, $event.target.value)" />
        <button @click.prevent="removeEmailInput(index)">删除</button>
      </div>
      <button @click="addEmailInput">添加电子邮件输入框</button>
      <button type="submit">提交</button>
    </form>
    <div v-if="submittedData2">
      <h3>提交的数据：</h3>
      <pre>{{ submittedData2 }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref('hhhhhmmmmm');

const formData = ref({
  textInput: '',
  radioInput: '',
  checkboxes: [],
  selectInput: ''
});

const submittedData = ref(null);
let formError = ref('');

const submitForm1 = () => {
  const dataCopy = {...formData.value };
  if (!dataCopy.textInput || dataCopy.textInput.trim() === '') {
    formError.value = '文本输入框不能为空。';
    return;
  }
  if (!dataCopy.selectInput || dataCopy.selectInput === '') {
    formError.value = '请选择一个选项。';
    return;
  }
  if (dataCopy.checkboxes.length === 0) {
    formError.value = '至少选择一个复选框。';
    return;
  }
  submittedData.value = dataCopy;
  formError.value = '';
};

const emailInputs = ref(['']);
const submittedData2 = ref(null);

const addEmailInput = () => {
  emailInputs.value.push('');
};

const removeEmailInput = (index) => {
  emailInputs.value.splice(index, 1);
};

const updateEmailInput = (index, value) => {
  emailInputs.value[index] = value;
};

const submitForm2 = () => {
  submittedData2.value = emailInputs.value.filter((input) => input.trim()!== '');
};
</script>

<style scoped>
.error {
  color: red;
}
</style>