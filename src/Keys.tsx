import { useState } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const { initialData, sorting } = props;

    // Состояние списка с данными
    const [data, setData] = useState<IItem[]>(initialData);

    // ID редактируемого элемента
    const [editingId, setEditingId] = useState<number | null>(null);

    // Локальное значение при редактировании
    const [editValues, setEditValues] = useState<Record<number, string>>({});

    const sortedData = [...data].sort((a, b) =>
        sorting === 'ASC' ? a.id - b.id : b.id - a.id,
    );

    const handleNameClick = (id: number) => {
        setEditingId(id);
        setEditValues((prev) => ({
            ...prev,
            [id]: data.find((item) => item.id === id)?.name || '',
        }));
    };

    const handleChange = (id: number, value: string) => {
        setEditValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: number,
    ) => {
        if (e.key === 'Enter') {
            // Сохраняем новое имя в состоянии
            setData((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, name: editValues[id] } : item,
                ),
            );
            setEditingId(null);
        }

        if (e.key === 'Escape') {
            setEditingId(null);
            setEditValues((prev) => {
                const newValues = { ...prev };
                delete newValues[id];
                return newValues;
            });
        }
    };

    return (
        <div>
            {sortedData.map((item) => {
                const isEditing = editingId === item.id;
                const inputValue = editValues[item.id] ?? item.name;

                return (
                    <div key={item.id}>
                        {isEditing ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) =>
                                    handleChange(item.id, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                autoFocus
                            />
                        ) : (
                            <span onClick={() => handleNameClick(item.id)}>
                                {item.name}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
