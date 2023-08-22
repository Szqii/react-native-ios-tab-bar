import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import {View, ViewStyle} from "react-native"
import Animated, {
    AnimatedStyleProp, Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated"

export const RNTabBar = observer((
    props: {
        children: React.JSX.Element[] | React.JSX.Element,
        activeIndex?: number,
        activeColor?: string,
        backgroundColor?: string,
        width?: number,
        height?: number,
        borderRadius?: number,
        padding?: number,
        onActiveIndexChange?: (index: number) => void,
    },
) => {
    const optionCount = React.Children.count(props.children)
    const [activeIndex, setActiveIndex] = React.useState(props.activeIndex || 0)
    const width = props.width || 80 * optionCount
    const height = props.height || 32
    const offset = useSharedValue(0)
    const borderRadius = props.borderRadius || 10
    const activeColor = props.activeColor || "white"
    const backgroundColor = props.backgroundColor || "gray"
    const padding = props.padding || 2

    useEffect(() => {
        offset.value = activeIndex * ((width - (2 * padding)) / optionCount)
        props.onActiveIndexChange && props.onActiveIndexChange(activeIndex)
    }, [activeIndex])

    useEffect(() => {
        setActiveIndex(props.activeIndex || 0)
    }, [props.activeIndex])

    const style = {
        tabBarContainer: {
            width,
            height,
            padding,
            backgroundColor,
            borderRadius,
            flexDirection: "row",
            alignSelf: "center",
        } as ViewStyle,
        activeView: {
            width: (width - (2 * padding)) / optionCount,
            height: (height - (2 * padding)),
            backgroundColor: activeColor,
            marginHorizontal: padding,
            borderRadius: borderRadius * (1 - ((padding * 2) / height)),
            position: "absolute",
            top: padding,
        } as ViewStyle,
    }
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(offset.value, {
                    duration: 150,
                    easing: Easing.ease,
                }),
            }],
        } as AnimatedStyleProp<any>
    })

    const cloneChild = (child: React.JSX.Element, index: number) => {
        return React.cloneElement(child, {
            index,
            activeIndex,
            ...child.props,
            onActiveChange: (isActive: boolean) => {
                child.props.onActiveChange && child.props.onActiveChange(isActive)
            },
            onPress: () => {
                setActiveIndex(index)
                child.props.onPress && child.props.onPress()
            },
        })
    }

    let finalChildren: any;

    if (Array.isArray(props.children)) {
        finalChildren = props.children.map((child, index) => {
            const newChild = cloneChild(child, index)
            return [
                newChild,
            ]
        })
    } else {
        finalChildren = cloneChild(props.children, 0)
    }

    return (
        <View style={style.tabBarContainer}>
            <Animated.View style={[style.activeView, animatedStyle]}/>
            {finalChildren}
        </View>
    )
})
