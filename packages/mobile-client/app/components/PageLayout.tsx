import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PageLayoutProps {
    cornerSize?: number;
    topLeftCorner?: React.ReactNode; // For left corner in the header
    topRightCorner?: React.ReactNode; // For right corner in the header
    topContent?: React.ReactNode; // Content in the middle of the header
    centralContent: React.ReactNode; // Main central content
    leftSideContent?: React.ReactNode; // Optional content for side borders
    rightSideContent?: React.ReactNode; // Optional content for side borders
    bottomLeftCorner?: React.ReactNode; // For left corner in the header
    bottomRightCorner?: React.ReactNode; // For right corner in the header
    bottomContent?: React.ReactNode; // Content in the middle of the header
}

const PageLayout: React.FC<PageLayoutProps> = ({   
                                                   cornerSize,
                                                   topLeftCorner,
                                                   topRightCorner,
                                                   topContent,
                                                   centralContent,
                                                   leftSideContent,
                                                   rightSideContent,
                                                   bottomLeftCorner,
                                                   bottomRightCorner,
                                                   bottomContent,
                                               }) => {
    const cornerSizeStyle = cornerSize ?? 200;
    return (
        <View style={styles.container}  className="PageLayoutContainer">
            {/* Header */}
            <View className="PageLayoutHeader" style={[styles.header, { height: cornerSizeStyle }] } >
                { topLeftCorner &&  <View id="page-layout-top-left" style={[styles.headerSide, { width: cornerSizeStyle, height: cornerSizeStyle, paddingHorizontal: 0 }] }>{topLeftCorner}</View>}
                { topContent &&     <View id="page-layout-top" style={styles.headerCenter}>{topContent}</View>}
                { topRightCorner && <View id="page-layout-top-right" style={[styles.headerSide, { width: cornerSizeStyle }] }>{topRightCorner}</View>}
            </View>

            {/* Body */}
            <View style={styles.body}>
                {leftSideContent && <View id="page-layout-left" style={[styles.side, { width: cornerSizeStyle }] }>{leftSideContent}</View>}
                <View style={styles.central}>{centralContent}</View>
                {rightSideContent && <View id="page-layout-right" style={[styles.side, { width: cornerSizeStyle }] }>{rightSideContent}</View>}
            </View>
            <View style={[styles.header, { height: cornerSizeStyle }] }>
                { bottomLeftCorner &&  <View id="page-layout-bottom-left" style={[styles.headerSide, { width: cornerSizeStyle }] }>{bottomLeftCorner}</View>}
                { bottomContent &&     <View id="page-layout-bottom" style={styles.headerCenter}>{bottomContent}</View>}
                { bottomRightCorner && <View id="page-layout-bottom-right" style={[styles.headerSide, { width: cornerSizeStyle }] }>{bottomRightCorner}</View>}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282c34',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
    },
    headerSide: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        flexDirection: 'row',
    },
    side: {
        backgroundColor: '#444',
        alignItems: 'flex-start',
    },
    central: {
        flex: 1,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PageLayout;
