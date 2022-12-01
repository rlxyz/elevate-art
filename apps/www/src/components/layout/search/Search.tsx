import clsx from "clsx";

export interface Props {
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const defaultProps: Props = {
  placeholder: "Search",
  isLoading: false,
  initialValue: "",
};

export type SearchProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

const SearchComponent: React.FC<React.PropsWithChildren<SearchProps>> = ({
  className,
  initialValue,
  onChange,
  onFocus,
  onBlur,
  isLoading,
  placeholder,
  ...props
}: SearchProps & typeof defaultProps) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={clsx(isLoading && "hidden", "h-4 w-4 text-accents_5")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      <input
        {...props}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange && onChange(e);
        }}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
          onFocus && onFocus(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          onBlur && onBlur(e);
        }}
        type="text"
        className={clsx(
          className,
          isLoading ? "bg-mediumGrey animate-pulse rounded-[5px] border-none bg-opacity-50" : "border-mediumGrey border",
          "block w-full rounded-[5px] py-2 pl-10 text-xs",
          "focus:border-blueHighlight focus:ring-blueHighlight focus:outline-none focus:ring-1",
          "invalid:border-redError invalid:text-redError",
          "focus:invalid:border-redError focus:invalid:ring-redError",
        )}
        placeholder={isLoading ? "" : placeholder}
      />
    </div>
  );
};

SearchComponent.defaultProps = defaultProps;
SearchComponent.displayName = "Search";
export default SearchComponent;
