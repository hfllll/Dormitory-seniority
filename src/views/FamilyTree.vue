<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 导入图片资源
import 鱼饭 from '@/assets/鱼饭.jpg';
import 连杰 from '@/assets/连杰.jpg';
import 鱼成 from '@/assets/鱼成.jpg';
import 一红 from '@/assets/一红.jpg';
import 上古神兽 from '@/assets/上古神兽.jpg';
import 张三 from '@/assets/神.jpg';
import 牛龙 from '@/assets/牛龙.jpg';
import 七七的可 from '@/assets/七七的可.jpg';

// 定义家谱成员类型
interface FamilyMember {
    id: number;
    name: string;
    image: string;
    title: string;
    level: number;
    children: FamilyMember[];
    isSelected?: boolean;
    relations?: Record<number, string>; // 与其他成员的关系
}

const route = useRoute();
const router = useRouter();
const selectedRoleId = ref(Number(route.params.id || 0));
// 添加加载状态
const isLoading = ref(false);

// 家谱原始数据（不变的部分）
const originalMembers = [
    {
        id: 6,
        name: '张三',
        image: 张三,
        title: '成员',
        level: 2
    },
    {
        id: 5,
        name: '龟龟',
        image: 上古神兽,
        title: '成员',
        level: 2
    },
    {
        id: 2,
        name: '连杰',
        image: 连杰,
        title: '成员',
        level: 2
    },
    {
        id: 7,
        name: '六龙',
        image: 牛龙,
        title: '成员',
        level: 2
    },
    {
        id: 1,
        name: '邓鱼饭',
        image: 鱼饭,
        title: '成员',
        level: 2
    },
    {
        id: 3,
        name: '郑🐟成',
        image: 鱼成,
        title: '成员',
        level: 2
    },
    {
        id: 4,
        name: '陈一红',
        image: 一红,
        title: '成员',
        level: 2
    },
    {
        id: 8,
        name: '周七科',
        image: 七七的可,
        title: '成员',
        level: 2
    }
];

// 当前家谱树结构
const familyTree = ref<FamilyMember>({
    id: 6,
    name: '张三',
    image: 张三,
    title: '家谱始祖',
    level: 3,
    children: []
});

// 所有成员之间的关系映射
const allRelations = ref<Record<number, Record<number, string>>>({});

// 获取成员之间的关系
function getRelation(member1Id: number, member2Id: number): string {
    // 极端情况处理
    if (member1Id === member2Id) return "自己";
    
    // 获取两个成员在家谱树中的实际视觉层级
    const member1Level = getMemberVisualLevel(member1Id);
    const member2Level = getMemberVisualLevel(member2Id);
    
    // 特殊处理神
    if (member2Id === 6) { // 对神的称呼
        if (member1Level === 2) return "爸爸"; // 第二行看神是爸爸
        if (member1Level === 3) return "爷爷"; // 第三行看玮达是爷爷
        return "家族领袖";
    }
    
    if (member1Id === 6) { // 玮达对别人的称呼
        if (member2Level === 2) return "儿子"; // 玮达对第二行是儿子
        if (member2Level === 3) return "孙子"; // 玮达对第三行是孙子
        return "子民";
    }
    
    // 基于视觉位置的关系判断
    if (member1Level === member2Level) {
        return "兄弟"; // 同行是兄弟
    } else if (member1Level > member2Level) {
        // member2在member1上方
        return (member1Level - member2Level === 1) ? "爸爸" : "爷爷";
    } else {
        // member2在member1下方
        return (member2Level - member1Level === 1) ? "儿子" : "孙子";
    }
}

// 获取成员在视觉上的层级(第几行)
function getMemberVisualLevel(memberId: number): number {
    // 玮达永远在第一行
    if (memberId === 6) return 1;
    
    // 在第二行查找
    for (const secondLevelMember of familyTree.value.children) {
        if (secondLevelMember.id === memberId) {
            return 2; // 在第二行
        }
        
        // 在第三行查找
        if (secondLevelMember.children) {
            for (const thirdLevelMember of secondLevelMember.children) {
                if (thirdLevelMember.id === memberId) {
                    return 3; // 在第三行
                }
            }
        }
    }
    
    // 默认返回2(如果找不到，避免出错)
    return 2;
}

// 获取家族关系描述 - 基于视觉位置的关系描述
const getRelationshipDescription = () => {
    if (!selectedRoleId.value) return "";
    
    // 获取成员在家谱中的节点
    const memberNode = findSelectedMember(familyTree.value, selectedRoleId.value);
    if (!memberNode) return "家族成员";
    
    // 根据视觉层级返回关系描述
    const visualLevel = getMemberVisualLevel(selectedRoleId.value);
    
    // 根据视觉层级返回关系描述
    if (memberNode.id === 6) return "始祖"; // 玮达是至高神
    if (visualLevel === 2) return "第二代 "; // 第二行是家族大臣
    if (visualLevel === 3) return "第三代  平民子民"; // 第三行是平民子民
    
    return "家族成员";
};

/* 
 * 在家谱树中查找成员的实际层级
 * 这个函数用于兼容性，现在直接使用视觉层级
 */
function findMemberLevelInTree(_node: FamilyMember, targetId: number): number {
    return getMemberVisualLevel(targetId);
}

// 在家谱树中查找成员
const findMemberInTree = (node: FamilyMember, targetId: number): FamilyMember | null => {
    if (node.id === targetId) {
        return node;
    }

    if (node.children) {
        for (const child of node.children) {
            const found = findMemberInTree(child, targetId);
            if (found) return found;
        }
    }

    return null;
};

// 生成所有成员之间的关系
const generateAllRelations = () => {
    const relations: Record<number, Record<number, string>> = {};

    // 初始化关系映射
    originalMembers.forEach(member => {
        relations[member.id] = {};
    });

    // 为每对成员生成关系 - 使用新的关系计算方法
    for (let i = 0; i < originalMembers.length; i++) {
        for (let j = 0; j < originalMembers.length; j++) {
            if (i !== j) {
                const member1Id = originalMembers[i].id;
                const member2Id = originalMembers[j].id;

                // 使用path-based方法计算关系
                relations[member1Id][member2Id] = getRelation(member1Id, member2Id);
            }
        }
    }

    return relations;
};

// 随机打乱数组
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// 构建家谱树 - 确保固定的层级关系
const buildFamilyTree = () => {
    // 创建根节点（郑玮达始终是最高位）
    const root: FamilyMember = {
        ...originalMembers.find(m => m.id === 6)!,
        title: '爷爷',
        level: 3,
        children: []
    };
    
    // 获取并打乱除玮达外的所有成员
    const otherMembers = shuffleArray<typeof originalMembers[0]>(
        originalMembers.filter(m => m.id !== 6)
    );
    
    // 分配成员到第二代和第三代
    const secondGenCount = Math.ceil(otherMembers.length / 2);
    const secondGen = otherMembers.slice(0, secondGenCount);
    const thirdGen = otherMembers.slice(secondGenCount);
    
    // 创建第二代（儿子）
    const secondGenNodes: FamilyMember[] = [];
    secondGen.forEach(member => {
        secondGenNodes.push({ 
            ...member, 
            title: '家族大臣',
            level: 2,
            children: [] 
        });
    });
    
    // 确保至少有一个第二代成员
    if (secondGenNodes.length === 0) {
        // 如果没有第二代成员，从第三代提升一个
        if (thirdGen.length > 0) {
            const promoted = thirdGen.shift();
            if (promoted) {
                secondGenNodes.push({ 
                    ...promoted, 
                    title: '家族大臣',
                    level: 2,
                    children: [] 
                });
            }
        }
    }
    
    // 添加所有第二代节点到根节点
    root.children = secondGenNodes;
    
    // 如果有第三代成员，均匀分配给第二代成员作为子节点
    if (thirdGen.length > 0 && secondGenNodes.length > 0) {
        // 计算每个第二代成员至少应有的子节点数
        const minChildrenPerParent = Math.floor(thirdGen.length / secondGenNodes.length);
        let extraChildren = thirdGen.length % secondGenNodes.length;
        
        let thirdGenIndex = 0;
        
        // 为每个第二代成员分配第三代子节点
        for (const parent of secondGenNodes) {
            // 确定当前父节点应该有多少子节点
            const childrenCount = minChildrenPerParent + (extraChildren > 0 ? 1 : 0);
            extraChildren--;
            
            // 分配子节点
            for (let j = 0; j < childrenCount && thirdGenIndex < thirdGen.length; j++) {
                parent.children.push({
                    ...thirdGen[thirdGenIndex],
                    title: '平民子民',
                    level: 1,
                    children: []
                });
                thirdGenIndex++;
            }
        }
    }
    
    return root;
};

// 重新排列家谱
const reshuffleTree = () => {
    // 显示加载动画
    isLoading.value = true;
    
    // 延迟1500毫秒执行
    setTimeout(() => {
        // 重新生成关系
        allRelations.value = generateAllRelations();
        
        // 重建家谱树（郑玮达始终在顶层）
        familyTree.value = buildFamilyTree();
        
        // 重新标记选中角色
        highlightSelectedRole(familyTree.value, selectedRoleId.value);
        
        // 隐藏加载动画
        isLoading.value = false;
    }, 1500);
};

// 标记选中的角色
const highlightSelectedRole = (node: FamilyMember, selectedId: number) => {
    node.isSelected = node.id === selectedId;

    if (node.children) {
        node.children.forEach(child => {
            highlightSelectedRole(child, selectedId);
        });
    }
};

// 查找选中的角色
const findSelectedMember = (node: FamilyMember, selectedId: number): FamilyMember | null => {
    if (node.id === selectedId) {
        return node;
    }

    if (node.children) {
        for (const child of node.children) {
            const found = findSelectedMember(child, selectedId);
            if (found) return found;
        }
    }

    return null;
};

// 计算各成员的层级信息 - 用于显示和调试
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const memberLevels = computed(() => {
    const levels: Record<number, number> = {};
    originalMembers.forEach(member => {
        // 使用findMemberLevelInTree获取成员的实际层级
        levels[member.id] = findMemberLevelInTree(familyTree.value, member.id);
    });
    return levels;
});

// 获取选中角色和其他人的关系
const getSelectedRelationships = (selectedId: number): Record<number, string> => {
    const relationships: Record<number, string> = {};

    // 添加与所有人的关系
    originalMembers.forEach(member => {
        if (member.id !== selectedId) {
            relationships[member.id] = allRelations.value[selectedId]?.[member.id] || "未知关系";
        }
    });

    return relationships;
};

// 家谱路径名称
const getFamilyPath = (node: FamilyMember, targetId: number, path: string[] = []): string[] | null => {
    if (node.id === targetId) {
        return [...path, node.name];
    }

    if (node.children) {
        for (const child of node.children) {
            const found = getFamilyPath(child, targetId, [...path, node.name]);
            if (found) return found;
        }
    }

    return null;
};

const selectedMember = computed(() => {
    if (selectedRoleId.value) {
        return findSelectedMember(familyTree.value, selectedRoleId.value);
    }
    return null;
});

const relationships = computed(() => {
    if (selectedRoleId.value) {
        return getSelectedRelationships(selectedRoleId.value);
    }
    return {};
});

// 获取关系列表展示
const relationshipsList = computed(() => {
    if (!selectedRoleId.value) return [];

    return originalMembers
        .filter(member => member.id !== selectedRoleId.value)
        .map(member => {
            // 获取当前关系
            const relation = relationships.value[member.id] || "家人";
            
            return {
                id: member.id,
                name: member.name,
                relation: relation
            };
        });
});

// 返回选择页面
const backToSelection = () => {
    router.push('/');
};

// 添加计算属性：检查是否有第三层
const hasThirdLevel = computed(() => {
    if (!familyTree.value || !familyTree.value.children) return false;

    for (const child of familyTree.value.children) {
        if (child.children && child.children.length > 0) {
            return true;
        }
    }
    return false;
});

// 获取所有第三代成员（直接横向排列）
const getAllThirdGenMembers = (): FamilyMember[] => {
    const thirdGenMembers: FamilyMember[] = [];
    
    // 如果没有家谱树，返回空数组
    if (!familyTree.value || !familyTree.value.children) return thirdGenMembers;
    
    // 遍历所有第二代成员
    for (const secondGen of familyTree.value.children) {
        // 如果第二代成员有子节点（第三代成员）
        if (secondGen.children && secondGen.children.length > 0) {
            // 添加到第三代成员列表
            thirdGenMembers.push(...secondGen.children);
        }
    }
    
    return thirdGenMembers;
};

onMounted(() => {
    // 显示加载动画
    isLoading.value = true;

    // 延迟1500毫秒执行
    setTimeout(() => {
        // 生成所有成员之间的关系
        allRelations.value = generateAllRelations();

        // 构建初始家谱树
        familyTree.value = buildFamilyTree();

        // 标记选中角色
        highlightSelectedRole(familyTree.value, selectedRoleId.value);

        // 隐藏加载动画
        isLoading.value = false;
    }, 1500);
});
</script>

<template>
    <div class="family-tree-container">
        <!-- 加载动画 -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">正在构建家谱关系...</div>
            </div>
        </div>

        <div class="header">
            <div class="title">406宿舍家谱树</div>
            <div class="subtitle">谁是爸爸谁是儿子</div>
            <div v-if="selectedMember" class="selected-info">
                {{ selectedMember.name }} 你在家谱中的位置是
                <span class="identity-tag">{{ getRelationshipDescription() }}</span>
                <!-- debug信息，可在需要时显示 -->
                <span class="debug-info" style="display: none;">层级: {{ memberLevels[selectedMember.id] }}</span>
            </div>
        </div>

        <!-- 家谱树结构 -->
        <div class="family-tree" v-if="familyTree">
            <!-- 第一代（郑玮达） -->
            <div class="tree-level level-one">
                <div class="generation-label">第一代</div>
                <div class="member" :class="{ 'selected': familyTree.isSelected }">
                    <div class="crown"></div>
                    <div class="member-image">
                        <img :src="familyTree.image" :alt="familyTree.name" />
                    </div>
                    <div class="member-info">
                        <div class="member-name">{{ familyTree.name }}</div>
                        <div class="member-title">{{ familyTree.title }}</div>
                        <div v-if="selectedRoleId && familyTree.id !== selectedRoleId" class="relation-tag father-tag">
                            你的{{ relationships[familyTree.id] || '爸爸' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 连接线 -->
            <div class="level-line"></div>

            <!-- 第二代（儿子） -->
            <div class="tree-level level-two" v-if="familyTree.children && familyTree.children.length > 0">
                <div class="generation-label">第二代</div>
                <div class="level-members">
                    <template v-for="member in familyTree.children" :key="member.id">
                        <div class="member" :class="{ 'selected': member.isSelected }">
                            <div class="member-image">
                                <img :src="member.image" :alt="member.name" />
                            </div>
                            <div class="member-info">
                                <div class="member-name">{{ member.name }}</div>
                                <div class="member-title">{{ member.title }}</div>
                                <div v-if="selectedRoleId && member.id !== selectedRoleId" class="relation-tag">
                                    你的{{ relationships[member.id] || '家人' }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 连接线 -->
            <div class="central-line" v-if="hasThirdLevel"></div>

            <!-- 第三代（孙子） -->
            <div class="tree-level level-three" v-if="hasThirdLevel">
                <div class="generation-label">第三代</div>
                <div class="level-members">
                    <!-- 直接获取所有第三代成员并横向排列 -->
                    <template v-for="child in getAllThirdGenMembers()" :key="child.id">
                        <div class="member" :class="{ 'selected': child.isSelected }">
                            <div class="member-image">
                                <img :src="child.image" :alt="child.name" />
                            </div>
                            <div class="member-info">
                                <div class="member-name">{{ child.name }}</div>
                                <div class="member-title">{{ child.title }}</div>
                                <div v-if="selectedRoleId && child.id !== selectedRoleId" class="relation-tag">
                                    你的{{ relationships[child.id] || '家人' }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 关系列表 -->
            <div v-if="selectedMember" class="relationship-list">
                <h3>{{ selectedMember.name }}的家族关系</h3>
                <ul>
                    <li v-for="relation in relationshipsList" :key="relation.id">
                        <span class="relation-name">{{ relation.name }}</span>
                        <span class="relation-type">{{ relation.relation }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="shuffle-tip" v-if="selectedMember">
            想要重新排列家族关系？
        </div>

        <div class="action-buttons">
            <button class="action-button shuffle-button" @click="reshuffleTree">
                重组家谱
            </button>
            <button class="action-button back-button" @click="backToSelection">
                返回选择
            </button>
        </div>

        <div class="footer">
            <div class="double-happiness"></div>
        </div>
    </div>
</template>

<style scoped>
.family-tree-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff1f1;
    padding-bottom: 40px;
    font-family: 'Microsoft YaHei', sans-serif;
    position: relative;
    overflow-x: hidden;
}

.header {
    text-align: center;
    padding: 1.5rem 0;
    background: linear-gradient(to right, #f8a5a5, #e46060);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}

.title {
    font-size: 2.2rem;
    font-weight: bold;
    color: #d4000f;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
    font-size: 1rem;
    color: #8c1515;
    margin-top: 0.5rem;
}

.selected-info {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    display: inline-block;
    color: #d4000f;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.identity-tag {
    background-color: #ffde59;
    color: #d4000f;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-left: 5px;
}

/* 家谱树样式 */
.family-tree {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tree-level {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
}

.generation-label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    background-color: #d4000f;
    padding: 5px 15px;
    border-radius: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.level-line {
    width: 4px;
    height: 60px;
    background-color: #d4000f;
    position: relative;
    margin-bottom: 20px;
}

.level-line::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: #d4000f;
    border-radius: 50%;
}

.level-members,
.level-members-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
}

.level-members-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 30px;
}

.member-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.group-label {
    font-size: 1rem;
    color: #8c1515;
    margin-bottom: 10px;
    padding: 2px 15px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 15px;
    border: 1px solid #ffcbcb;
}

.group-members {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
}

/* 连接线 */
.level-connections {
    display: flex;
    justify-content: space-around;
    width: 80%;
    margin-bottom: 20px;
}

.connection-line {
    width: 2px;
    height: 40px;
    background-color: #d4000f;
    position: relative;
}

.connection-line::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: #d4000f;
    border-radius: 50%;
}

/* 成员通用样式 */
.member {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    position: relative;
    transition: all 0.3s ease;
    width: 110px;
}

.crown {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 30px;
    background-color: #ffde59;
    clip-path: polygon(0% 100%, 20% 50%, 30% 100%, 40% 50%, 50% 100%, 60% 50%, 70% 100%, 80% 50%, 100% 100%, 80% 30%, 100% 0%, 50% 15%, 0% 0%, 20% 30%);
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.member-image {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ffcbcb;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
}

.level-one .member-image {
    border-color: #ffde59;
    width: 80px;
    height: 80px;
}

.level-two .member-image {
    border-color: #e46060;
}

.level-three .member-image {
    border-color: #8c1515;
}

.selected .member-image {
    border-color: #f00;
    box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
}

.member-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.member-info {
    margin-top: 8px;
    text-align: center;
    width: 100%;
    position: relative;
}

.member-name {
    font-weight: bold;
    font-size: 0.9rem;
    color: #d4000f;
}

.level-one .member-name {
    font-size: 1.1rem;
}

.member-title {
    font-size: 0.7rem;
    color: #8c1515;
    margin-top: 2px;
}

.relation-tag {
    position: absolute;
    top: -25px;
    right: -20px;
    background-color: #ffde59;
    color: #d4000f;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    z-index: 10;
    transform: rotate(10deg);
    border: 1px solid #d4000f;
}

.father-tag {
    background-color: #d4000f;
    color: #ffde59;
    border-color: #ffde59;
}

/* 关系列表样式 */
.relationship-list {
    background-color: #fff;
    border-radius: 15px;
    padding: 15px;
    margin: 20px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    width: 400px;
    border: 2px solid #ffcbcb;
}

.relationship-list h3 {
    color: #d4000f;
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.2rem;
    border-bottom: 1px solid #ffcbcb;
    padding-bottom: 10px;
}

.relationship-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.relationship-list li {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px dashed #ffcbcb;
}

.relationship-list li:last-child {
    border-bottom: none;
}

.relation-name {
    font-weight: bold;
    color: #8c1515;
}

.relation-type {
    background-color: #ffde59;
    color: #d4000f;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: bold;
}

/* 按钮和提示 */
.shuffle-tip {
    text-align: center;
    margin: 1rem 0;
    padding: 0.5rem;
    font-size: 1.2rem;
    color: #8c1515;
}

.small-tip {
    font-size: 0.8rem;
    color: #d4000f;
    font-style: italic;
    display: block;
    margin-top: 0.3rem;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
}

.action-button {
    background-color: #d4000f;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(212, 0, 15, 0.3);
    transition: all 0.3s ease;
}

.shuffle-button {
    background-color: #ff9900;
}

.shuffle-button:hover {
    background-color: #e68a00;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(230, 138, 0, 0.4);
}

.back-button:hover {
    background-color: #b00000;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(212, 0, 15, 0.4);
}

/* 加载动画样式 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 241, 241, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-content {
    text-align: center;
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(212, 0, 15, 0.2);
    border: 2px solid #ffcbcb;
}

.loading-spinner {
    width: 60px;
    height: 60px;
    border: 5px solid #ffcbcb;
    border-top: 5px solid #d4000f;
    border-radius: 50%;
    margin: 0 auto 20px;
    animation: spin 1s linear infinite;
}

.loading-text {
    color: #d4000f;
    font-size: 1.2rem;
    font-weight: bold;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
}

.double-happiness {
    width: 60px;
    height: 60px;
    background-color: #f00;
    position: relative;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.double-happiness:before {
    content: "囍";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffde59;
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

/* 媒体查询确保在小屏幕上适配良好 */
@media (max-width: 768px) {
    .member {
        width: 95px;
    }

    .member-image {
        width: 60px;
        height: 60px;
    }

    .level-one .member-image {
        width: 70px;
        height: 70px;
    }

    .relation-tag {
        font-size: 0.65rem;
        padding: 1px 5px;
        top: -20px;
        right: -15px;
    }

    .shuffle-tip {
        font-size: 1rem;
    }

    .generation-label {
        font-size: 1rem;
        padding: 4px 12px;
    }

    .action-buttons {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .action-button {
        width: 80%;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 1.5rem;
    }

    .subtitle {
        font-size: 0.8rem;
    }

    .member-name {
        font-size: 0.8rem;
    }

    .level-one .member-name {
        font-size: 0.9rem;
    }

    .member-title {
        font-size: 0.65rem;
    }

    .relation-tag {
        font-size: 0.6rem;
        padding: 1px 4px;
        top: -18px;
        right: -12px;
    }

    .member {
        width: 85px;
    }

    .member-image {
        width: 50px;
        height: 50px;
        border-width: 2px;
    }

    .level-one .member-image {
        width: 60px;
        height: 60px;
    }

    .generation-label {
        font-size: 0.9rem;
        padding: 3px 10px;
    }

    .crown {
        width: 30px;
        height: 22px;
        top: -15px;
    }
}

.central-line {
    width: 4px;
    height: 60px;
    background-color: #d4000f;
    position: relative;
    margin-bottom: 20px;
}

.central-line::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: #d4000f;
    border-radius: 50%;
}
</style>