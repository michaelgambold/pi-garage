import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DropdownField } from '../../src/components/DropdownField';

jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const { View } = require('react-native');
  const MockMenu = ({ visible, anchor, children }: any) => (
    <View testID="mock-menu">
      {anchor}
      {visible ? <View testID="mock-menu-content">{children}</View> : null}
    </View>
  );
  MockMenu.Item = ({ title, onPress }: any) => (
    <View testID={`menu-item-${title}`} accessibilityLabel={title} onTouchEnd={onPress}>
      {title}
    </View>
  );
  return {
    ...actual,
    Menu: MockMenu,
  };
});

describe('DropdownField', () => {
  const options = [
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
  ];

  const renderWithProviders = (element: React.ReactElement) => {
    return (
      <SafeAreaProvider
        initialMetrics={{
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
          frame: { x: 0, y: 0, width: 375, height: 812 },
        }}
      >
        {element}
      </SafeAreaProvider>
    );
  };

  it('renders label and current value label correctly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        renderWithProviders(
          <DropdownField
            label="State"
            value="open"
            options={options}
            onSelect={jest.fn()}
          />,
        ),
      );
    });

    const root = tree.root;
    const texts = root.findAllByType('Text').map((t: any) => t.props.children);
    expect(texts).toContain('State');
    expect(texts).toContain('Open');
  });

  it('renders closed label when value is closed', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        renderWithProviders(
          <DropdownField
            label="State"
            value="closed"
            options={options}
            onSelect={jest.fn()}
          />,
        ),
      );
    });

    const root = tree.root;
    const texts = root.findAllByType('Text').map((t: any) => t.props.children);
    expect(texts).toContain('State');
    expect(texts).toContain('Closed');
  });

  it('handles onSelect when option is pressed', () => {
    const onSelectMock = jest.fn();
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        renderWithProviders(
          <DropdownField
            label="State"
            value="open"
            options={options}
            onSelect={onSelectMock}
          />,
        ),
      );
    });

    const root = tree.root;
    // Press the anchor to open the menu
    const pressable = root.findByProps({ accessibilityLabel: 'Select State' });
    ReactTestRenderer.act(() => {
      pressable.props.onPress();
    });

    // Find the 'Closed' menu item
    const closedItem = root.findByProps({ testID: 'menu-item-Closed' });
    expect(closedItem).toBeDefined();

    // Trigger onTouchEnd
    ReactTestRenderer.act(() => {
      closedItem.props.onTouchEnd();
    });

    expect(onSelectMock).toHaveBeenCalledWith('closed');
  });

  it('does not open menu when disabled', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        renderWithProviders(
          <DropdownField
            label="State"
            value="open"
            options={options}
            onSelect={jest.fn()}
            disabled
          />,
        ),
      );
    });

    const root = tree.root;
    const pressable = root.findByProps({ accessibilityLabel: 'Select State' });
    ReactTestRenderer.act(() => {
      pressable.props.onPress();
    });

    const menuContent = root.findAllByProps({ testID: 'mock-menu-content' });
    expect(menuContent.length).toBe(0);
  });
});
