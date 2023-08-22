import React from "react"
import {useEffect, useState} from "react"
import {observer} from "mobx-react-lite"
import {Pressable, View, ViewStyle} from "react-native"

export const RNTabBarOption = observer((
        props: {
            children: React.JSX.Element[] | React.JSX.Element,
            index?: number,
            activeIndex?: number,
            onActiveChange?: (isActive: boolean) => void,
            onActive?: () => void,
            onPress?: () => void,
        },
    ) => {
        const [isActive, setIsActive] = useState(false)

        useEffect(() => {
            setIsActive(props.index === props.activeIndex)
        }, [props.activeIndex])

        useEffect(() => {
            isActive && props.onActive && props.onActive()
            props.onActiveChange && props.onActiveChange(true)
        }, [isActive])

        const handlePress = () => {
            props.onPress && props.onPress()
        }

        const styles = {
            optionContainer: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                paddingVertical: 6,
            } as ViewStyle,
        }

        return (
            <View style={styles.optionContainer}>
                <Pressable onPress={handlePress}>
                    {props.children}
                </Pressable>
            </View>
        )
    },
)
