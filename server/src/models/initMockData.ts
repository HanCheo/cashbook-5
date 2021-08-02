import Category from "./category.model"

const initialCategories = [
    { id: 1, color: "#6ed5eb", name: "적금" },
    { id: 2, color: "#4cb8b8", name: "예금" },
    { id: 3, color: "#94d3cc", name: "주식" },
    { id: 4, color: "#4ca1de", name: "용돈" },
    { id: 5, color: "#d092e2", name: "식사" },
    { id: 6, color: "#817dce", name: "취미" },
    { id: 7, color: "#4a6cc3", name: "유흥" },
    { id: 8, color: "#b9d58c", name: "월급" },
    { id: 9, color: "#e6d267", name: "보험" },
    { id: 10, color: "#e2b765", name: "기타" },
]

export const initMockDataAsync = async () => {
    for (const data of (initialCategories)) {
        const category = await Category.findOne({ where: { id: data.id } });

        if (category === null) {
            await Category.create({
                id: data.id,
                name: data.name,
                color: data.color,
            })
        }
    }
}