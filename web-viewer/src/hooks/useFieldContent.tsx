/** @jsxImportSource preact */
import { VNode } from 'preact';
import { FieldType, detectFieldType } from '../utils/fieldTypes';
import { JsonViewer } from '../components/atoms/JsonViewer';
import { KeyValueViewer } from '../components/atoms/KeyValueViewer';
import { CodeViewer } from '../components/atoms/CodeViewer';
import { TextViewer } from '../components/atoms/TextViewer';
import { URLViewer } from '../components/atoms/URLViewer';
import { SvgViewer } from '../components/atoms/SvgViewer';
import { ImageViewer } from '../components/atoms/ImageViewer';

interface UseFieldContentResult {
  content: VNode;
  fieldType: FieldType;
}

interface UseFieldContentOptions {
  label: string;
  value: string;
  isCode?: boolean;
  className?: string;
  hideHeader?: boolean;
}

/**
 * Custom hook to determine and render appropriate field content
 */
export const useFieldContent = ({
  label,
  value,
  isCode = false,
  className = '',
  hideHeader = false,
}: UseFieldContentOptions): UseFieldContentResult => {
  const fieldType = detectFieldType(label, isCode, value);

  let content: VNode;

  switch (fieldType) {
    case FieldType.JSON:
      content = <JsonViewer value={value} className={className} />;
      break;

    case FieldType.COOKIES:
      content = (
        <KeyValueViewer
          value={value}
          type="cookies"
          className={className}
          hideHeader={hideHeader}
        />
      );
      break;

    case FieldType.HEADERS:
      content = (
        <KeyValueViewer
          value={value}
          type="headers"
          className={className}
          hideHeader={hideHeader}
        />
      );
      break;

    case FieldType.CODE:
      content = <CodeViewer value={value} className={className} />;
      break;

    case FieldType.URL:
      content = <URLViewer value={value} className={className} />;
      break;

    case FieldType.SVG:
      content = <SvgViewer value={value} className={className} />;
      break;

    case FieldType.IMAGE:
      content = <ImageViewer value={value} className={className} />;
      break;

    case FieldType.TEXT:
    default:
      content = <TextViewer value={value} className={className} />;
      break;
  }

  return {
    content,
    fieldType,
  };
};
