import { useState } from 'react';

export function useModalState() {
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [fullViewTable, setFullViewTable] = useState<string | null>(null);

  return {
    showCompareModal, setShowCompareModal,
    showSaveModal, setShowSaveModal,
    showLoadModal, setShowLoadModal,
    showSchemaModal, setShowSchemaModal,
    showPythonModal, setShowPythonModal,
    showChartModal, setShowChartModal,
    fullViewTable, setFullViewTable,
  };
}
