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
    cornerSize = cornerSize ?? 200;
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { height: {cornerSize} }] } >
                { topLeftCorner && <View style={[styles.headerSide, { width: {cornerSize} }] }>{topLeftCorner}</View>}
                { topContent && <View style={styles.headerCenter}>{topContent}</View>}
                { topRightCorner && <View style={[styles.headerSide, { width: {cornerSize} }] }>{topRightCorner}</View>}
            </View>

            {/* Body */}
            <View style={styles.body}>
                {leftSideContent && <View style={[styles.header, { width: {cornerSize} }] }>{leftSideContent}</View>}
                <View style={styles.central}>{centralContent}</View>
                {rightSideContent && <View style={[styles.header, { width: {cornerSize} }] }>{rightSideContent}</View>}
            </View>
            <View style={[styles.header, { height: {cornerSize} }] }>
                { bottomLeftCorner && <View style={[styles.headerSide, { width: {cornerSize} }] }>{bottomLeftCorner}</View>}
                { bottomContent && <View style={styles.headerCenter}>{bottomContent}</View>}
                { bottomRightCorner && <View style={[styles.headerSide, { width: {cornerSize} }] }>{bottomRightCorner}</View>}
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
        paddingHorizontal: 10,
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
    },
    central: {
        flex: 1,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PageLayout;
