<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 导入图片资源
import 鱼饭 from '@/assets/鱼饭.jpg';
import 连杰 from '@/assets/连杰.jpg';
import 鱼成 from '@/assets/鱼成.jpg';
import 一红 from '@/assets/一红.jpg';
import 上古神兽 from '@/assets/上古神兽.jpg';
import 神 from '@/assets/神.jpg';
import 牛龙 from '@/assets/牛龙.jpg';
import 七七的可 from '@/assets/七七的可.jpg';

const router = useRouter();
// 添加提示消息的状态
const showMessage = ref(false);
const message = ref('');

// 定义角色列表
const roles = ref([
  { id: 1, name: '🐟🍚', image: 鱼饭 },
  { id: 2, name: '×杰', image: 连杰 },
  { id: 3, name: '🐟×', image: 鱼成 },
  { id: 4, name: '①红', image: 一红 },
  { id: 5, name: '🐢🐢', image: 上古神兽 },
  { id: 6, name: '神', image: 神 },
  { id: 7, name: '🐂🐉', image: 牛龙 },
  { id: 8, name: '⑦🉑', image: 七七的可 },
]);

// 处理角色选择事件
const selectRole = (roleId: number) => {
  // 神(id为6)，则显示提示消息
  if (roleId === 6) {
    message.value = '神是不可以被选择的';
    showMessage.value = true;
    
    // 3秒后隐藏消息
    setTimeout(() => {
      showMessage.value = false;
    }, 3000);
    
    return;
  }
  
  router.push(`/family-tree/${roleId}`);
};

// 关闭消息提示
const closeMessage = () => {
  showMessage.value = false;
};
</script>

<template>
    <div class="role-selection">
        <!-- 提示消息 -->
        <div v-if="showMessage" class="message-popup">
            <div class="message-content">
                {{ message }}
                <button class="close-button" @click="closeMessage">×</button>
            </div>
        </div>
        
        <div class="header">
            <div class="title">谁爸爸谁儿子</div>
            <div class="title">选择一位角色，随机生成</div>
            <div class="subtitle">406宿舍家谱树</div>
        </div>

        <div class="image-wall">
            <div v-for="role in roles" :key="role.id" class="role-card" @click="selectRole(role.id)">
                <div class="image-container">
                    <img :src="role.image" :alt="role.name" />
                </div>
                <div class="role-name">{{ role.name }}</div>
            </div>
        </div>

        <div class="footer">
            <div class="lanterns left"></div>
            <div class="double-happiness"></div>
            <div class="lanterns right"></div>
        </div>
    </div>
    <!-- <img src="@/assets/神.jpg" alt=""> -->
</template>

<style scoped>
.role-selection {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff1f1;
  background-image: linear-gradient(45deg, #ffecec 25%, transparent 25%, transparent 75%, #ffecec 75%, #ffecec), 
                    linear-gradient(45deg, #ffecec 25%, transparent 25%, transparent 75%, #ffecec 75%, #ffecec);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

/* 消息提示样式 */
.message-popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid #d4000f;
  animation: fadeIn 0.3s ease;
}

.message-content {
  padding: 15px 40px 15px 20px;
  color: #d4000f;
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #d4000f;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(to right, #f8a5a5, #e46060);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4000f;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #8c1515;
  margin-top: 0.8rem;
}

.image-wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;
  justify-content: center;
}

.role-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(212, 0, 15, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 2px solid #ffcbcb;
}

.role-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(212, 0, 15, 0.25);
  border-color: #f00;
}

.role-card:before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #f00, #ff9e9e, #f00, #ff9e9e);
  background-size: 400% 400%;
  z-index: -1;
  border-radius: 14px;
  animation: gradientAnimation 3s ease infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.role-card:hover:before {
  opacity: 1;
}

.image-container {
  padding: 1.5rem;
  background-color: #fff3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.image-container img {
  max-width: 100%;
  max-height: 120px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.role-card:hover .image-container img {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 10px rgba(212, 0, 15, 0.25));
}

.role-name {
  text-align: center;
  padding: 1rem 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: #d4000f;
  background-color: #fff;
  border-top: 1px dashed #ffcbcb;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background-color: #d4000f;
  height: 60px;
}

.double-happiness {
  width: 80px;
  height: 80px;
  background-color: #f00;
  position: relative;
  margin: 0 auto;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.double-happiness:before, .double-happiness:after {
  content: "囍";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffde59;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.lanterns {
  width: 30px;
  height: 50px;
  background-color: #f00;
  border-radius: 15px;
  position: relative;
  margin: 0 2rem;
}

.lanterns:before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 8px;
  background-color: #ffde59;
  border-radius: 10px 10px 0 0;
}

.lanterns:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 10px;
  background-color: #ffde59;
  border-radius: 0 0 50% 50%;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.god-role {
  /* 移除神的特殊样式 */
}

.god-aura {
  /* 移除神的特殊光环 */
}

.god-tag {
  /* 移除神的特殊标签 */
}

.god-role .image-container {
  /* 移除神的特殊容器样式 */
}

@media (max-width: 768px) {
  .image-wall {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .god-role {
    transform: scale(1.05);
  }
  
  .god-tag {
    font-size: 0.7rem;
    padding: 1px 6px;
    top: -10px;
    right: -10px;
  }
}
</style> 