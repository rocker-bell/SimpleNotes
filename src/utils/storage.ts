// export const saveAccounts = (accounts: any[]) => {
//   chrome.storage.local.set({ hederaAccounts: accounts });
// };

// export const loadAccounts = (): Promise<any[]> => {
//   return new Promise((resolve) => {
//     chrome.storage.local.get(
//       ["hederaAccounts"],
//       (result: { hederaAccounts?: any[] }) => {
//         resolve(result.hederaAccounts || []);
//       }
//     );
//   });
// };


// export type HederaAccount = {
//   accountId: string
//   privateKey: string
//   evmAddress: string
// }

// export const saveAccounts = (accounts: HederaAccount[]) => {
//   chrome.storage.local.set({ hederaAccounts: accounts })
// }

// export const loadAccounts = (): Promise<HederaAccount[]> => {
//   return new Promise((resolve) => {
//     chrome.storage.local.get(
//       ["hederaAccounts"],
//       (result: { hederaAccounts?: HederaAccount[] }) => {
//         resolve(result.hederaAccounts || [])
//       }
//     )
//   })
// }

// export const saveActiveAccount = (index: number) => {
//   chrome.storage.local.set({ activeAccountIndex: index })
// }

// export const loadActiveAccount = (): Promise<number | null> => {
//   return new Promise((resolve) => {
//     chrome.storage.local.get(
//       ["activeAccountIndex"],
//       (result: { activeAccountIndex?: number }) => {
//         resolve(result.activeAccountIndex ?? null)
//       }
//     )
//   })
// }


export type HederaAccount = {
  accountId: string
  privateKey: string
  evmAddress: string
}

// Save accounts
export const saveAccounts = (accounts: HederaAccount[]) => {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.set({ hederaAccounts: accounts })
  } else {
    localStorage.setItem("hederaAccounts", JSON.stringify(accounts))
  }
}

// Load accounts
export const loadAccounts = (): Promise<HederaAccount[]> => {
  return new Promise((resolve) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get(
        ["hederaAccounts"],
        (result: { hederaAccounts?: HederaAccount[] }) => {
          resolve(result.hederaAccounts || [])
        }
      )
    } else {
      const saved = localStorage.getItem("hederaAccounts")
      resolve(saved ? JSON.parse(saved) : [])
    }
  })
}

// Save active account index
export const saveActiveAccount = (index: number) => {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.set({ activeAccountIndex: index })
  } else {
    localStorage.setItem("activeAccountIndex", JSON.stringify(index))
  }
}

// Load active account index
export const loadActiveAccount = (): Promise<number | null> => {
  return new Promise((resolve) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get(
        ["activeAccountIndex"],
        (result: { activeAccountIndex?: number }) => {
          resolve(result.activeAccountIndex ?? null)
        }
      )
    } else {
      const saved = localStorage.getItem("activeAccountIndex")
      resolve(saved ? JSON.parse(saved) : null)
    }
  })
}